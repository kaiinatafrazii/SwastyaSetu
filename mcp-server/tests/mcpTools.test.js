/**
 * Comprehensive Test Suite for Rural Emergency Assistance MCP Server
 * Uses Node.js native test runner (node:test & node:assert)
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  analyzeEmergencySituation,
  getEmergencyCategoriesList,
  getFirstAidGuideByCategory,
  findNearbyHealthcareFacilities,
  getSystemHealthStatus,
  executeEmergencyChat,
  EMERGENCY_SERVICES,
  DEMO_SCENARIOS
} from '../lib/backendBridge.js';

test('MCP Tool: analyze_emergency — Critical Chest Pain Scenario', async () => {
  const result = await analyzeEmergencySituation({
    symptoms: 'Crushing chest pain radiating to left arm and sweating',
    description: 'Patient is a 55-year-old farmer sitting on the ground',
    age: '55',
    locationContext: 'Rural field, 10km from nearest hospital'
  });

  assert.equal(result.success, true);
  assert.equal(result.assessment.category.id, 'chest_pain');
  assert.equal(result.assessment.severity.level, 'critical');
  assert.equal(result.assessment.immediateActionRequired, true);
  assert.equal(result.assessment.callEmergencyPrompt, true);
  assert.equal(result.assessment.emergencyNumber, '112');
  assert.ok(result.firstAid.steps.length > 0);
  assert.ok(result.firstAid.warnings.length > 0);
  assert.ok(result.safety.disclaimer);
  assert.ok(result.safety.disclaimerHi);
});

test('MCP Tool: analyze_emergency — Deterministic Safety Escalation for Life-Threatening Keywords', async () => {
  const result = await analyzeEmergencySituation({
    symptoms: 'Person was hit by tractor, heavy bleeding and stopped breathing',
    description: 'Unresponsive on the ground'
  });

  assert.equal(result.assessment.severity.level, 'critical');
  assert.equal(result.assessment.immediateActionRequired, true);
  assert.equal(result.assessment.callEmergencyPrompt, true);
});

test('MCP Tool: analyze_emergency — Mental Health Crisis Detection & Resource Provisioning', async () => {
  const result = await analyzeEmergencySituation({
    symptoms: 'Feeling hopeless, thinking of self harm and want to die',
    description: 'Needs help'
  });

  assert.equal(result.assessment.severity.level, 'critical');
  assert.ok(result.mentalHealthCrisis);
  assert.ok(result.mentalHealthCrisis.numbers.length > 0);
  assert.equal(result.mentalHealthCrisis.numbers[0].number, '112');
});

test('MCP Tool: analyze_emergency — Minor Injury Handling (Less Urgent)', async () => {
  const result = await analyzeEmergencySituation({
    symptoms: 'Minor hot water splash on forearm, small blister',
    description: 'Accident while cooking tea'
  });

  assert.equal(result.success, true);
  assert.equal(result.assessment.category.id, 'burns');
  assert.ok(result.firstAid.steps.length > 0);
});

test('MCP Tool: get_emergency_categories — Full 14 Curated Categories', () => {
  const categories = getEmergencyCategoriesList();

  assert.equal(categories.length, 14);
  const categoryIds = categories.map(c => c.id);
  
  assert.ok(categoryIds.includes('chest_pain'));
  assert.ok(categoryIds.includes('severe_bleeding'));
  assert.ok(categoryIds.includes('snake_bite'));
  assert.ok(categoryIds.includes('choking'));
  assert.ok(categoryIds.includes('burns'));
  assert.ok(categoryIds.includes('unconsciousness'));
  assert.ok(categoryIds.includes('poisoning'));
  assert.ok(categoryIds.includes('stroke'));

  for (const cat of categories) {
    assert.ok(cat.id);
    assert.ok(cat.name);
    assert.ok(cat.nameHi);
    assert.ok(cat.icon);
    assert.ok(cat.severity);
  }
});

test('MCP Tool: get_first_aid_guide — Valid Category (snake_bite)', () => {
  const guide = getFirstAidGuideByCategory('snake_bite');

  assert.ok(guide);
  assert.equal(guide.category.id, 'snake_bite');
  assert.ok(guide.category.name.includes('Snake'));
  assert.equal(guide.severity.level, 'critical');
  assert.ok(guide.firstAidSteps.length >= 5);
  assert.ok(guide.warnings.length > 0);
  assert.ok(guide.doNots.length > 0);
  assert.ok(guide.disclaimer);
});

test('MCP Tool: get_first_aid_guide — Invalid Category Handling', () => {
  const guide = getFirstAidGuideByCategory('non_existent_category_xyz');
  assert.equal(guide, null);
});

test('MCP Tool: find_nearby_facilities — Real or Fallback Facility Retrieval', async () => {
  const result = await findNearbyHealthcareFacilities({
    latitude: 25.5846,
    longitude: 85.1491,
    radius: 15000
  });

  assert.equal(result.success, true);
  assert.ok(result.facilities.length > 0);
  
  const facility = result.facilities[0];
  assert.ok(facility.name);
  assert.ok(facility.type);
  assert.ok(facility.latitude);
  assert.ok(facility.longitude);
  assert.ok(typeof facility.distance === 'number');
  assert.ok(facility.estimatedTime);
});

test('MCP Tool: find_nearby_facilities — Facility Type Filtering', async () => {
  const result = await findNearbyHealthcareFacilities({
    latitude: 25.5846,
    longitude: 85.1491,
    radius: 15000,
    facilityType: 'hospital'
  });

  assert.equal(result.success, true);
  assert.ok(result.facilities.every(f => f.type === 'hospital' || f.typeLabel?.en?.toLowerCase() === 'hospital'));
});

test('MCP Tool: get_emergency_services — All Essential Emergency Numbers', () => {
  assert.equal(EMERGENCY_SERVICES.primary.number, '112');
  assert.equal(EMERGENCY_SERVICES.ambulance.number, '102');
  assert.equal(EMERGENCY_SERVICES.disasterAmbulance.number, '108');
  assert.equal(EMERGENCY_SERVICES.police.number, '100');
  assert.equal(EMERGENCY_SERVICES.fire.number, '101');
  assert.equal(EMERGENCY_SERVICES.womenHelpline.number, '181');
  assert.equal(EMERGENCY_SERVICES.childHelpline.number, '1098');
  assert.equal(EMERGENCY_SERVICES.poisonControl.number, '1800-11-6117');
  assert.ok(EMERGENCY_SERVICES.mentalHealth.length >= 2);
});

test('MCP Tool: get_system_status — Verification of Health & Engines', async () => {
  const status = await getSystemHealthStatus();

  assert.equal(status.status, 'ok');
  assert.equal(status.service, 'Rural Emergency Assistance MCP Server');
  assert.ok(status.aiService);
  assert.ok(status.safetyEngine.active);
  assert.equal(status.knowledgeBase.categoriesCount, 14);
});

test('MCP Tool: get_demo_scenario — 5 Pre-configured Scenarios', () => {
  assert.equal(DEMO_SCENARIOS.length, 5);
  const ids = DEMO_SCENARIOS.map(s => s.id);
  assert.deepEqual(ids, ['demo_1', 'demo_2', 'demo_3', 'demo_4', 'demo_5']);
});

test('MCP Tool: emergency_chat — Dialogue & Helpline Guidance', async () => {
  const chat = await executeEmergencyChat({
    messages: [
      { sender: 'user', text: 'Someone was bitten by a snake, what should I do right now?' }
    ]
  });

  assert.ok(chat.reply);
  assert.equal(chat.emergencyHelpline, '112');
});
