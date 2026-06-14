// ============================================
// Promoo Backend — Express App Configuration
// ============================================
// Sets up Express with all middleware.
// Exports the app instance (server.ts starts listening).

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler.middleware';
import { generalLimiter } from './middleware/rateLimit.middleware';
import routes from './routes/index';
import { logger } from './utils/logger';

const app = express();

// ─── Security Headers ───────────────────────
app.use(helmet());

// ─── CORS ───────────────────────────────────
const corsOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language'],
  })
);

// ─── Body Parsing ───────────────────────────
// NOTE: Stripe webhooks need raw body — register that route BEFORE json parser
import { webhookController } from './controllers/webhook.controller';
app.post(`/api/${env.API_VERSION}/webhooks/stripe`, express.raw({ type: 'application/json' }), webhookController.handleStripeWebhook);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Rate Limiting ──────────────────────────
app.use(generalLimiter);

// ─── Request Logging ────────────────────────
app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
});

// ─── API Routes ─────────────────────────────
app.use(`/api/${env.API_VERSION}`, routes);

// ─── 404 Handler ────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: 'Route not found',
    error: { code: 'NOT_FOUND' },
  });
});

// ─── Global Error Handler (must be last) ────
app.use(errorHandler);

export default app;
