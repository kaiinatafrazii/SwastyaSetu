/**
 * Emergency Tools for MCP Server
 * 
 * Tools:
 * 1. analyze_emergency
 * 2. get_emergency_categories
 */

import { z } from 'zod';
import { analyzeEmergencySituation, getEmergencyCategoriesList } from '../lib/backendBridge.js';
import { logger } from '../lib/logger.js';

export function registerEmergencyTools(server) {
  /**
   * Tool 1: analyze_emergency
   */
  server.tool(
    'analyze_emergency',
    'Analyze medical emergency symptoms and descriptions using AI reasoning backed by deterministic safety rules. Returns category, severity level, immediate action required, safety warnings, and first-aid instructions.',
    {
      symptoms: z.string().min(2).describe('Primary symptoms or condition observed (e.g., "severe chest pain and left arm numbness", "heavy bleeding from farm machinery")'),
      description: z.string().optional().describe('Additional context, details, duration, or what happened'),
      age: z.string().optional().describe('Patient age or age group (e.g., "45", "elderly", "infant", "child")'),
      location_context: z.string().optional().describe('Environmental or geographical context (e.g., "remote farm field", "2 hours from town")')
    },
    async ({ symptoms, description, age, location_context }) => {
      try {
        logger.info('Tool call: analyze_emergency', { symptoms: symptoms.substring(0, 50) });

        const result = await analyzeEmergencySituation({
          symptoms,
          description,
          age,
          locationContext: location_context
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error('Error in analyze_emergency tool', { error: error.message });
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Failed to analyze emergency situation.',
                details: error.message,
                emergencyAdvice: 'If this is a critical medical emergency, please call 112 immediately.'
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  /**
   * Tool 2: get_emergency_categories
   */
  server.tool(
    'get_emergency_categories',
    'Get all 14 curated emergency categories supported by the platform (e.g., chest_pain, severe_bleeding, snake_bite, choking, etc.) along with bilingual names and severity rankings.',
    {},
    async () => {
      try {
        logger.info('Tool call: get_emergency_categories');
        const categories = getEmergencyCategoriesList();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                count: categories.length,
                categories
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error('Error in get_emergency_categories tool', { error: error.message });
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Failed to retrieve emergency categories.',
                details: error.message
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}
