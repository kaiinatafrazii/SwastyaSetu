/**
 * Healthcare Facilities Tools for MCP Server
 * 
 * Tools:
 * 1. find_nearby_facilities
 */

import { z } from 'zod';
import { findNearbyHealthcareFacilities } from '../lib/backendBridge.js';
import { logger } from '../lib/logger.js';

export function registerFacilityTools(server) {
  /**
   * Tool 4: find_nearby_facilities
   */
  server.tool(
    'find_nearby_facilities',
    'Find real nearby healthcare facilities (hospitals, clinics, CHC community health centers, doctors, pharmacies) based on GPS coordinates using OpenStreetMap Overpass query with mirror failover and verified fallback emergency facilities.',
    {
      latitude: z.number().min(-90).max(90).describe('User or incident latitude coordinate (e.g. 25.5846)'),
      longitude: z.number().min(-180).max(180).describe('User or incident longitude coordinate (e.g. 85.1491)'),
      radius_meters: z.number().int().positive().max(50000).optional().default(15000).describe('Search radius in meters (default: 15000 = 15km, max: 50000 = 50km)'),
      facility_type: z.enum(['hospital', 'clinic', 'health_centre', 'doctor', 'pharmacy', 'healthcare']).optional().describe('Optional filter by facility type')
    },
    async ({ latitude, longitude, radius_meters = 15000, facility_type }) => {
      try {
        logger.info('Tool call: find_nearby_facilities', { latitude, longitude, radius_meters, facility_type });

        const result = await findNearbyHealthcareFacilities({
          latitude,
          longitude,
          radius: radius_meters,
          facilityType: facility_type
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
        logger.error('Error in find_nearby_facilities tool', { error: error.message });
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Failed to find nearby healthcare facilities.',
                details: error.message,
                emergencyNote: 'If you require immediate medical transport or hospital care, call 112 or 102/108 immediately.'
              }, null, 2)
            }
          ]
        };
      }
    }
  );
}
