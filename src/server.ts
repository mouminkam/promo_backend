// ============================================
// Promoo Backend — Server Entry Point
// ============================================
// Starts the Express server and handles graceful shutdown.

import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Promoo Backend running on port ${PORT}`);
  logger.info(`📍 Environment: ${env.NODE_ENV}`);
  logger.info(`🔗 API Base: http://localhost:${PORT}/api/${env.API_VERSION}`);
  logger.info(`❤️  Health Check: http://localhost:${PORT}/api/${env.API_VERSION}/health`);
});

// ─── Graceful Shutdown ──────────────────────

function gracefulShutdown(signal: string): void {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ─── Unhandled Errors ───────────────────────

process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ reason }, 'Unhandled Promise Rejection');
});

process.on('uncaughtException', (error: Error) => {
  logger.fatal({ error }, 'Uncaught Exception — shutting down');
  process.exit(1);
});
