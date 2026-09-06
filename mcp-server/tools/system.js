/**
 * System and Utility Tools for MCP Server
 * 
 * Tools:
 * 1. get_emergency_services
 * 2. get_system_status
 * 3. get_demo_scenario
 * 4. emergency_chat
 */

import { z } from 'zod';
import {
  EMERGENCY_SERVICES,
  DEMO_SCENARIOS,
  getSystemHealthStatus,
  executeEmergencyChat
} from '../lib/backendBridge.js';
import { logger } from '../lib/logger.js';

export function registerSystemTools(server) {
  /**
   * Tool 5: get_emergency_services
   */
  server.tool(
    'get_emergency_services',
    'Get official emergency contact numbers and distress hotlines supported by the platform (e.g. 112 National Emergency, 102/108 Ambulance, 100 Police, 101 Fire, 181 Women Helpline, 1098 Childline, Poison Info, and Mental Health Helplines).',
    {},
    async () => {
      try {
        logger.info('Tool call: get_emergency_services');

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                emergencyServices: EMERGENCY_SERVICES
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error('Error in get_emergency_services tool', { error: error.message });
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Failed to retrieve emergency services.',
                details: error.message,
                primaryEmergencyNumber: '112'
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  /**
   * Tool 6: get_system_status
   */
  server.tool(
    'get_system_status',
    'Get live system health, AI service mode (Gemini vs deterministic keyword fallback), deterministic safety rules status, knowledge base metrics, and uptime.',
    {},
    async () => {
      try {
        logger.info('Tool call: get_system_status');
        const status = await getSystemHealthStatus();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                system: status
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error('Error in get_system_status tool', { error: error.message });
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                status: 'error',
                error: error.message
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  /**
   * Tool 7: get_demo_scenario
   */
  server.tool(
    'get_demo_scenario',
    'Get pre-configured rural emergency demo scenarios for testing platform capabilities safely without requiring real emergency patient data.',
    {
      scenario_id: z.enum(['demo_1', 'demo_2', 'demo_3', 'demo_4', 'demo_5']).optional().describe('Optional specific scenario ID (demo_1 = Chest Pain, demo_2 = Bleeding, demo_3 = Unconscious, demo_4 = Choking, demo_5 = Burn)')
    },
    async ({ scenario_id }) => {
      try {
        logger.info('Tool call: get_demo_scenario', { scenario_id });

        if (scenario_id) {
          const scenario = DEMO_SCENARIOS.find(s => s.id === scenario_id);
          if (!scenario) {
            return {
              isError: true,
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    error: `Scenario ${scenario_id} not found.`
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
                  scenario
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
                count: DEMO_SCENARIOS.length,
                scenarios: DEMO_SCENARIOS
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error('Error in get_demo_scenario tool', { error: error.message });
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Failed to retrieve demo scenarios.',
                details: error.message
              }, null, 2)
            }
          ]
        };
      }
    }
  );

  /**
   * Tool 8 (Bonus): emergency_chat
   */
  server.tool(
    'emergency_chat',
    'Engage in a conversational first-aid dialogue supporting English, Hindi (हिन्दी), and Hinglish with safety-first medical guidance and automatic helpline escalation.',
    {
      messages: z.array(
        z.object({
          sender: z.enum(['user', 'assistant', 'system']),
          text: z.string().min(1)
        })
      ).min(1).describe('Conversation history array containing messages with sender and text properties')
    },
    async ({ messages }) => {
      try {
        logger.info('Tool call: emergency_chat', { messageCount: messages.length });
        const chatResponse = await executeEmergencyChat({ messages });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                ...chatResponse
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        logger.error('Error in emergency_chat tool', { error: error.message });
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Chat response failed.',
                details: error.message,
                emergencyAdvice: 'In case of urgent emergency, please call 112 immediately.'
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}
