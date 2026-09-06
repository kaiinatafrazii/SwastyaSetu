/**
 * MCP Prompts for Rural Emergency Assistance Platform
 * 
 * Prompts:
 * - emergency-assessment
 * - first-aid-guidance
 * - rural-emergency-response
 * - nearby-healthcare-assistance
 */

import { z } from 'zod';
import { logger } from '../lib/logger.js';

export function registerPrompts(server) {
  /**
   * Prompt 1: Emergency Assessment
   */
  server.prompt(
    'emergency-assessment',
    'Evaluate an active medical emergency using deterministic safety rules and AI triage to provide immediate life-saving recommendations.',
    {
      symptoms: z.string().describe('Patient symptoms, trauma, or emergency description'),
      patient_context: z.string().optional().describe('Age, consciousness level, or environment context')
    },
    async ({ symptoms, patient_context }) => {
      logger.info('Prompt invoked: emergency-assessment');
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `You are acting as an AI Rural Emergency Triage Assistant. Evaluate the following emergency:\n\nSymptoms: ${symptoms}\n${patient_context ? `Context: ${patient_context}\n` : ''}\nInstructions:\n1. Use the 'analyze_emergency' tool to determine category, severity level, and mandatory warnings.\n2. In critical situations (chest pain, severe bleeding, unconsciousness, snake bite, choking), ALWAYS emphasize calling 112 immediately.\n3. Output concise, numbered immediate first-aid steps.\n4. Clearly list what NOT to do (do-nots).\n5. Never invent diagnoses or medication dosages.`
            }
          }
        ]
      };
    }
  );

  /**
   * Prompt 2: First-Aid Guidance
   */
  server.prompt(
    'first-aid-guidance',
    'Get curated step-by-step first-aid protocols, warnings, and do-nots for a specific medical condition.',
    {
      condition: z.string().describe('Emergency condition or category (e.g. burns, snake bite, choking, fracture, bleeding)')
    },
    async ({ condition }) => {
      logger.info('Prompt invoked: first-aid-guidance', { condition });
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Provide standard, safe first-aid guidance for: ${condition}.\n\nInstructions:\n1. Use the 'get_first_aid_guide' tool to look up the verified knowledge base protocol.\n2. Summarize the steps clearly in simple, layperson language.\n3. Include critical safety warnings and things to avoid (do-nots).\n4. Remind the user that this advice is for first-aid only and does not replace emergency medical personnel.`
            }
          }
        ]
      };
    }
  );

  /**
   * Prompt 3: Rural Emergency Response
   */
  server.prompt(
    'rural-emergency-response',
    'Specialized protocol for handling remote or low-resource emergency scenarios where professional help may have high transit latency.',
    {
      situation: z.string().describe('Detailed incident description in a rural or remote area'),
      location_coordinates: z.string().optional().describe('Optional GPS coordinates in format "lat,lng"')
    },
    async ({ situation, location_coordinates }) => {
      logger.info('Prompt invoked: rural-emergency-response');
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `A medical emergency has occurred in a rural, remote area with limited immediate resources:\n\nSituation: ${situation}\n${location_coordinates ? `Coordinates: ${location_coordinates}\n` : ''}\nAction Plan:\n1. Execute 'analyze_emergency' to assess life threats and required immediate stabilization actions.\n2. If coordinates are provided, invoke 'find_nearby_facilities' to locate the nearest Community Health Centre (CHC), Civil Hospital, or trauma center.\n3. List official emergency numbers (112, 102/108) using 'get_emergency_services'.\n4. Provide stabilization instructions while awaiting transport.`
            }
          }
        ]
      };
    }
  );

  /**
   * Prompt 4: Nearby Healthcare Assistance
   */
  server.prompt(
    'nearby-healthcare-assistance',
    'Locate nearest healthcare facilities, compute travel times, and get dispatch contact numbers.',
    {
      latitude: z.string().describe('Latitude coordinate (e.g. "25.5846")'),
      longitude: z.string().describe('Longitude coordinate (e.g. "85.1491")'),
      urgency_level: z.string().optional().describe('Urgency level: critical, urgent, or routine')
    },
    async ({ latitude, longitude, urgency_level = 'urgent' }) => {
      logger.info('Prompt invoked: nearby-healthcare-assistance', { latitude, longitude });
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Locate medical facilities near latitude ${latitude}, longitude ${longitude} (Urgency: ${urgency_level}).\n\nInstructions:\n1. Call 'find_nearby_facilities' with coordinates ${latitude}, ${longitude}.\n2. Present the nearest hospitals/CHCs ranked by travel time and emergency capability.\n3. Provide phone numbers and estimated road transit times.\n4. If urgency is critical, advise calling 112 / 108 ambulance dispatch immediately.`
            }
          }
        ]
      };
    }
  );
}
