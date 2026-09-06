#!/usr/bin/env node
/**
 * Rural Emergency Assistance Platform — Model Context Protocol (MCP) Server
 * 
 * Exposes emergency triage, deterministic safety engine, first-aid knowledge base,
 * OSM facility finder, and emergency contacts to MCP clients (Claude Desktop, Cursor, etc.).
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { logger } from './lib/logger.js';
import { registerEmergencyTools } from './tools/emergency.js';
import { registerFirstAidTools } from './tools/firstAid.js';
import { registerFacilityTools } from './tools/facilities.js';
import { registerSystemTools } from './tools/system.js';
import { registerResources } from './resources/index.js';
import { registerPrompts } from './prompts/index.js';

// Load environment variables with MCP settings taking precedence over backend/root defaults.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../backend/.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

async function main() {
  logger.info('Initializing Rural Emergency Assistance MCP Server...');

  const server = new McpServer({
    name: 'rural-emergency-mcp-server',
    version: '1.0.0',
    description: 'AI-Powered Rural Emergency Assistance Platform MCP Server'
  });

  // Register Tools
  registerEmergencyTools(server);
  registerFirstAidTools(server);
  registerFacilityTools(server);
  registerSystemTools(server);
  logger.info('Registered all MCP Tools (8 tools)');

  // Register Resources
  registerResources(server);
  logger.info('Registered all MCP Resources (4 resources)');

  // Register Prompts
  registerPrompts(server);
  logger.info('Registered all MCP Prompts (4 prompts)');

  // Connect via Stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  logger.info('Rural Emergency Assistance MCP Server connected and listening on stdio');
}

main().catch((error) => {
  logger.error('Fatal MCP Server startup error', { error: error.message, stack: error.stack });
  process.exit(1);
});
