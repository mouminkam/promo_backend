// ============================================
// Promoo Backend — Webhook Controller
// ============================================

import { Request, Response, NextFunction } from 'express';
import { stripe } from '../config/stripe';
import { env } from '../config/env';
import { subscriptionService } from '../services/subscription.service';
import { seatService } from '../services/seat.service';
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
      // Route events based on type and metadata
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const paymentType = session.metadata?.type;

        // ALWAYS route to subscriptionService to handle 'payments' table insertion
        await subscriptionService.handleStripeWebhook(event);

        // Additionally route to seatService specifically to update seat status
        if (paymentType === 'seat_booking') {
          await seatService.handleStripeWebhook(session);
        }
      } else {
        // Pass subscription/invoice events to subscription service
        await subscriptionService.handleStripeWebhook(event);
      }
      res.status(200).json({ received: true });
    } catch (err: any) {
      logger.error(`Webhook processing error: ${err.message}`);
      // Return a 500 response to inform Stripe of the failure so it retries the event
      res.status(500).json({ received: false, error: err.message });
    }
  }
}

export const webhookController = new WebhookController();
