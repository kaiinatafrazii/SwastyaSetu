/**
 * Safe Logger for MCP Server
 * 
 * IMPORTANT: Because StdioServerTransport uses process.stdout for JSON-RPC messages,
 * standard console.log would corrupt the JSON-RPC framing and disconnect clients.
 * This logger routes all logs exclusively to process.stderr.
 */

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const currentLevel = (process.env.LOG_LEVEL || 'info').toLowerCase();
const threshold = LOG_LEVELS[currentLevel] ?? LOG_LEVELS.info;

function formatMessage(level, message, meta) {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [MCP-${level.toUpperCase()}] ${message}${metaStr}\n`;
}

export const logger = {
  debug(message, meta) {
    if (threshold <= LOG_LEVELS.debug) {
      process.stderr.write(formatMessage('debug', message, meta));
    }
  },
  info(message, meta) {
    if (threshold <= LOG_LEVELS.info) {
      process.stderr.write(formatMessage('info', message, meta));
    }
  },
  warn(message, meta) {
    if (threshold <= LOG_LEVELS.warn) {
      process.stderr.write(formatMessage('warn', message, meta));
    }
  },
  error(message, meta) {
    if (threshold <= LOG_LEVELS.error) {
      process.stderr.write(formatMessage('error', message, meta));
    }
  }
};
