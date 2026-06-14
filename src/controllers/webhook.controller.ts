// ============================================
// Promoo Backend — Webhook Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { stripe } from '../config/stripe';
import { env } from '../config/env';
import { subscriptionService } from '../services/subscription.service';
import { logger } from '../utils/logger';

export class WebhookController {
  /**
   * Handle Stripe Webhooks
   */
  async handleStripeWebhook(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      // req.body is a raw buffer here because we configured it in app.ts
      event = stripe.webhooks.constructEvent(req.body, sig as string, env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      logger.error(`Webhook signature verification failed: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    try {
      // Pass the event to the subscription service to process
      await subscriptionService.handleStripeWebhook(event);
      res.status(200).json({ received: true });
    } catch (err: any) {
      logger.error(`Webhook processing error: ${err.message}`);
      // Return a 200 response to acknowledge receipt of the event
      res.status(200).json({ received: true, error: err.message });
    }
  }
}

export const webhookController = new WebhookController();
