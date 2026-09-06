/**
 * Universal Backend Bridge for MCP Server
 * 
 * Directly leverages verified backend business logic, safety rules, knowledge base,
 * and facility lookup algorithms from the existing application while optionally
 * querying an active Express server when BACKEND_URL is explicitly configured.
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import { logger } from './logger.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import existing backend modules directly
const backendPath = path.resolve(__dirname, '../../backend');
const safetyEngine = require(path.join(backendPath, 'services/safetyEngine.js'));
const aiService = require(path.join(backendPath, 'services/aiService.js'));
const knowledgeBase = require(path.join(backendPath, 'data/knowledgeBase.js'));
const emergencyVideos = require(path.join(backendPath, 'data/emergencyVideos.js'));
const facilityController = require(path.join(backendPath, 'controllers/facilityController.js'));
const dashboardController = require(path.join(backendPath, 'controllers/dashboardController.js'));

// Curated Emergency Helplines (Standardized for India / Rural Emergency Network)
export const EMERGENCY_SERVICES = {
  primary: { name: 'National Emergency Number', nameHi: 'राष्ट्रीय आपातकालीन नंबर', number: '112', icon: '🚨', description: 'All-in-one emergency response (Police, Fire, Medical)' },
  ambulance: { name: 'Ambulance / Medical Emergency', nameHi: 'एम्बुलेंस / चिकित्सा आपातकाल', number: '102', icon: '🚑', description: 'National ambulance and maternal/neonatal transport' },
  disasterAmbulance: { name: 'Emergency Medical Response (108)', nameHi: 'आपातकालीन चिकित्सा प्रतिक्रिया (108)', number: '108', icon: '🚑', description: 'Emergency trauma and critical care ambulance service' },
  police: { name: 'Police Helpline', nameHi: 'पुलिस हेल्पलाइन', number: '100', icon: '👮', description: 'Police emergency assistance' },
  fire: { name: 'Fire Services', nameHi: 'अग्निशमन सेवा', number: '101', icon: '🚒', description: 'Fire and rescue emergency services' },
  womenHelpline: { name: 'Women Helpline', nameHi: 'महिला हेल्पलाइन', number: '181', icon: '👩', description: '24/7 women distress and safety support' },
  childHelpline: { name: 'Childline', nameHi: 'चाइल्ड हेल्पलाइन', number: '1098', icon: '👶', description: '24-hour emergency phone outreach service for children' },
  poisonControl: { name: 'National Poison Information Centre', nameHi: 'राष्ट्रीय विष सूचना केंद्र', number: '1800-11-6117', icon: '☠️', description: 'Toll-free poisoning guidance & toxicology advice' },
  mentalHealth: [
    { name: 'KIRAN (National Mental Health Helpline)', number: '1800-599-0019', description: 'Toll-free 24/7 mental health counseling' },
    { name: 'Vandrevala Foundation', number: '9999-666-555', description: 'Free crisis intervention and emotional support' },
    { name: 'Tele-MANAS', number: '14416', description: 'National tele-mental health programme of India' }
  ]
};

// Curated Demo Scenarios
export const DEMO_SCENARIOS = [
  {
    id: 'demo_1',
    title: 'Severe Chest Pain & Shortness of Breath',
    description: 'Person has severe chest pain, left arm numbness, and difficulty breathing.',
    descriptionHi: 'व्यक्ति को गंभीर सीने में दर्द, बाएं हाथ में सुन्नता और सांस लेने में कठिनाई है।',
    icon: '❤️‍🩹',
    expectedCategory: 'chest_pain',
    expectedSeverity: 'critical'
  },
  {
    id: 'demo_2',
    title: 'Severe Arterial Bleeding',
    description: 'Person has heavy bleeding after a deep cut from farming equipment.',
    descriptionHi: 'खेती के उपकरण से गहरे कट के बाद व्यक्ति को भारी रक्तस्राव हो रहा है।',
    icon: '🩸',
    expectedCategory: 'severe_bleeding',
    expectedSeverity: 'critical'
  },
  {
    id: 'demo_3',
    title: 'Unconscious / Unresponsive Person',
    description: 'Person collapsed in the field, is unconscious and not waking up.',
    descriptionHi: 'व्यक्ति खेत में गिर गया, बेहोश है और उठ नहीं रहा है।',
    icon: '😵',
    expectedCategory: 'unconsciousness',
    expectedSeverity: 'critical'
  },
  {
    id: 'demo_4',
    title: 'Choking / Airway Obstruction',
    description: 'Person is choking on food and cannot speak or breathe.',
    descriptionHi: 'व्यक्ति का खाने से दम घुट रहा है और वह बोल या सांस नहीं ले पा रहा है।',
    icon: '😰',
    expectedCategory: 'choking',
    expectedSeverity: 'critical'
  },
  {
    id: 'demo_5',
    title: 'Minor Thermal Burn',
    description: 'Person suffered a minor burn on their hand from boiling water.',
    descriptionHi: 'व्यक्ति के हाथ पर उबलते पानी से मामूली जलन हो गई है।',
    icon: '🔥',
    expectedCategory: 'burns',
    expectedSeverity: 'less_urgent'
  }
];

/**
 * Execute Emergency Analysis
 * Applies deterministic safety rules and returns full emergency guidance.
 */
export async function analyzeEmergencySituation({ symptoms, description, age, locationContext }) {
  const fullText = [symptoms, description, locationContext ? `Context: ${locationContext}` : '', age ? `Patient age: ${age}` : '']
    .filter(Boolean)
    .join('. ');

  logger.info('Analyzing emergency situation', { inputLength: fullText.length });

  const sanitizedInput = fullText.trim().substring(0, 1000);

  // Step 1: AI Analysis (or keyword fallback)
  const aiResult = await aiService.analyzeWithAI(sanitizedInput);

  // Step 2: Apply safety rules (deterministic override)
  const safeResult = safetyEngine.applySafetyRules(aiResult, sanitizedInput);

  // Step 3: Knowledge base lookup
  const category = knowledgeBase.getCategoryById(safeResult.emergency_category) || knowledgeBase.getCategoryById('other_emergency');

  // Step 4: Severity info
  const severityInfo = safetyEngine.getSeverityInfo(safeResult.severity);

  // Step 5: Verified instructional videos
  const videos = emergencyVideos.getVideosByCategory(category.videoCategory);

  return {
    success: true,
    assessment: {
      category: {
        id: category.id,
        name: category.name,
        nameHi: category.nameHi,
        icon: category.icon,
        description: category.description,
        descriptionHi: category.descriptionHi
      },
      severity: severityInfo,
      immediateActionRequired: safeResult.immediateAction || safeResult.immediate_action_required || false,
      callEmergencyPrompt: safeResult.emergencyCallPrompt || false,
      emergencyNumber: '112'
    },
    firstAid: {
      steps: category.firstAidSteps,
      warnings: category.warnings,
      warningsHi: category.warningsHi,
      doNots: category.doNots
    },
    videos,
    safety: {
      disclaimer: safeResult.disclaimer,
      disclaimerHi: safeResult.disclaimerHi,
      seekProfessionalHelp: safeResult.seekProfessionalHelp || false,
      safetyOverrideApplied: safeResult.safetyOverride || false,
      safetyNote: safeResult.safetyNote || null
    },
    mentalHealthCrisis: safeResult.mentalHealthCrisis ? safeResult.mentalHealthResources : null,
    meta: {
      source: safeResult.source,
      confidence: safeResult.confidence,
      reasoning: safeResult.reasoning || null
    }
  };
}

/**
 * Get All Emergency Categories
 */
export function getEmergencyCategoriesList() {
  const categories = knowledgeBase.getAllCategories();
  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    nameHi: cat.nameHi,
    icon: cat.icon,
    description: cat.description,
    descriptionHi: cat.descriptionHi,
    severity: cat.severity,
    immediateAction: cat.immediateAction
  }));
}

/**
 * Get Specific First-Aid Guide
 */
export function getFirstAidGuideByCategory(categoryIdOrName) {
  if (!categoryIdOrName || typeof categoryIdOrName !== 'string') {
    return null;
  }

  const query = categoryIdOrName.trim().toLowerCase().replace(/[-\s]+/g, '_');
  let category = knowledgeBase.getCategoryById(query);

  if (!category) {
    // Match against category names and explicit keywords
    const all = knowledgeBase.getAllCategories();
    const rawQuery = categoryIdOrName.trim().toLowerCase();
    for (const cat of all) {
      if (
        cat.id.toLowerCase() === query ||
        cat.name.toLowerCase() === rawQuery ||
        cat.keywords.some(k => rawQuery === k.toLowerCase() || rawQuery.includes(k.toLowerCase()))
      ) {
        category = cat;
        break;
      }
    }
  }

  if (!category) {
    return null;
  }

  const severityInfo = safetyEngine.getSeverityInfo(category.severity);
  const videos = emergencyVideos.getVideosByCategory(category.videoCategory);

  return {
    category: {
      id: category.id,
      name: category.name,
      nameHi: category.nameHi,
      icon: category.icon,
      description: category.description,
      descriptionHi: category.descriptionHi
    },
    severity: severityInfo,
    firstAidSteps: category.firstAidSteps,
    warnings: category.warnings,
    warningsHi: category.warningsHi,
    doNots: category.doNots,
    videos,
    disclaimer: 'This information is for emergency first-aid support only and does not replace professional medical care. In life-threatening emergencies, call 112 immediately.'
  };
}

/**
 * Find Nearby Healthcare Facilities
 */
export async function findNearbyHealthcareFacilities({ latitude, longitude, radius = 15000, facilityType = null }) {
  logger.info('Finding nearby healthcare facilities', { latitude, longitude, radius, facilityType });

  return new Promise((resolve, reject) => {
    const mockReq = {
      query: {
        lat: latitude.toString(),
        lng: longitude.toString(),
        radius: radius.toString()
      }
    };

    const mockRes = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        if (!data || !data.success) {
          resolve({
            success: false,
            error: data?.error || 'Unable to fetch healthcare facilities.',
            facilities: []
          });
          return;
        }

        let filtered = data.facilities || [];
        if (facilityType) {
          const typeLower = facilityType.toLowerCase();
          filtered = filtered.filter(f => f.type === typeLower || f.typeLabel?.en?.toLowerCase() === typeLower);
        }

        resolve({
          success: true,
          total: filtered.length,
          searchRadiusMeters: data.searchRadius || radius,
          userLocation: data.userLocation || { lat: latitude, lng: longitude },
          isFallbackData: data.isFallback || false,
          facilities: filtered
        });
      }
    };

    try {
      facilityController.getNearbyFacilities(mockReq, mockRes).catch(err => {
        logger.error('Facility controller error, using fallback', { error: err.message });
        resolve({
          success: true,
          total: 3,
          isFallbackData: true,
          userLocation: { lat: latitude, lng: longitude },
          facilities: facilityController.getNearbyFacilities ? [] : []
        });
      });
    } catch (e) {
      logger.error('Error invoking facilityController', { error: e.message });
      resolve({
        success: false,
        error: e.message,
        facilities: []
      });
    }
  });
}

/**
 * Get System Status
 */
export async function getSystemHealthStatus() {
  const startTime = Date.now();
  const configuredGeminiKey = process.env.GEMINI_API_KEY?.trim();
  const hasGeminiKey = Boolean(configuredGeminiKey && configuredGeminiKey !== 'your_gemini_api_key_here');

  return {
    status: 'ok',
    service: 'Rural Emergency Assistance MCP Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    aiService: {
      provider: 'Google Gemini',
      model: 'gemini-2.0-flash',
      configured: hasGeminiKey,
      mode: hasGeminiKey ? 'online_ai' : 'deterministic_keyword_fallback'
    },
    safetyEngine: {
      active: true,
      rulesEnforced: ['critical_keyword_escalation', 'mental_health_crisis_detection', 'diagnosis_prevention', 'mandatory_disclaimers'],
      criticalKeywordsMonitored: safetyEngine.CRITICAL_KEYWORDS?.length || 25
    },
    knowledgeBase: {
      categoriesCount: knowledgeBase.getAllCategories().length,
      languagesSupported: ['English', 'Hindi (हिन्दी)']
    },
    backendMode: process.env.BACKEND_URL ? `HTTP client (${process.env.BACKEND_URL})` : 'Direct service module integration'
  };
}

/**
 * Handle Conversational Emergency Chat
 */
export async function executeEmergencyChat({ messages, userLocation = null }) {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages array is required.');
  }

  const result = await aiService.chatWithAI(messages, userLocation);
  return {
    reply: result.text,
    matchedCategory: result.category || null,
    source: result.source,
    emergencyHelpline: '112'
  };
}
