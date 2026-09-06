/**
 * MCP Resources for Rural Emergency Assistance Platform
 * 
 * Resources:
 * - emergency://categories
 * - emergency://services
 * - emergency://system-status
 * - emergency://demo-scenarios
 */

import {
  getEmergencyCategoriesList,
  getFirstAidGuideByCategory,
  EMERGENCY_SERVICES,
  DEMO_SCENARIOS,
  getSystemHealthStatus
} from '../lib/backendBridge.js';
import { logger } from '../lib/logger.js';

export function registerResources(server) {
  /**
   * Resource 1: Emergency Categories List
   */
  server.resource(
    'emergency-categories',
    'emergency://categories',
    async (uri) => {
      logger.info('Resource accessed: emergency://categories');
      const categories = getEmergencyCategoriesList();
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(categories, null, 2)
          }
        ]
      };
    }
  );

  /**
   * Resource 2: Emergency Contact Services & Hotlines
   */
  server.resource(
    'emergency-services',
    'emergency://services',
    async (uri) => {
      logger.info('Resource accessed: emergency://services');
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(EMERGENCY_SERVICES, null, 2)
          }
        ]
      };
    }
  );

  /**
   * Resource 3: System Health & AI Status
   */
  server.resource(
    'system-status',
    'emergency://system-status',
    async (uri) => {
      logger.info('Resource accessed: emergency://system-status');
      const status = await getSystemHealthStatus();
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(status, null, 2)
          }
        ]
      };
    }
  );

  /**
   * Resource 4: Demo Scenarios
   */
  server.resource(
    'demo-scenarios',
    'emergency://demo-scenarios',
    async (uri) => {
      logger.info('Resource accessed: emergency://demo-scenarios');
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(DEMO_SCENARIOS, null, 2)
          }
        ]
      };
    }
  );
}
