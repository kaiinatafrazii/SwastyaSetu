/**
 * First Aid Tools for MCP Server
 * 
 * Tools:
 * 1. get_first_aid_guide
 */

import { z } from 'zod';
import { getFirstAidGuideByCategory } from '../lib/backendBridge.js';
import { logger } from '../lib/logger.js';

export function registerFirstAidTools(server) {
  /**
   * Tool 3: get_first_aid_guide
   */
  server.tool(
    'get_first_aid_guide',
    'Retrieve comprehensive, step-by-step first-aid guidance, vital warnings, do-nots, and instructional videos for a specific emergency category (e.g., "snake_bite", "chest_pain", "severe_bleeding", "choking", "burns").',
    {
      category_id: z.string().min(1).describe('The emergency category identifier or name (e.g., "snake_bite", "chest_pain", "burns", "choking", "severe_bleeding", "fracture", "unconsciousness", "allergic_reaction", "seizure", "poisoning", "stroke", "high_fever")')
    },
    async ({ category_id }) => {
      try {
        logger.info('Tool call: get_first_aid_guide', { category_id });

        const guide = getFirstAidGuideByCategory(category_id);

        if (!guide) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: `Emergency category '${category_id}' not found.`,
                  availableCategories: [
                    'chest_pain', 'breathing_difficulty', 'severe_bleeding', 'burns',
                    'fracture', 'unconsciousness', 'seizure', 'poisoning', 'stroke',
                    'allergic_reaction', 'choking', 'high_fever', 'snake_bite', 'other_emergency'
                  ]
                }, null, 2)
              }
            ]
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                firstAidGuide: guide
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error('Error in get_first_aid_guide tool', { error: error.message });
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Failed to retrieve first aid guide.',
                details: error.message
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}
