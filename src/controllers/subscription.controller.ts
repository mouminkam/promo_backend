// ============================================
// Promoo Backend — Subscription Controller
// ============================================

import { Response, NextFunction } from 'express';
import { subscriptionService } from '../services/subscription.service';
import { apiResponse } from '../utils/apiResponse';
import { IAuthRequest } from '../types/api.types';

export class SubscriptionController {
  /**
   * Get all active subscription plans
   */
  async getPlans(_req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await subscriptionService.getPlans();
      apiResponse.success(res, data, 'Plans retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a Mobile Subscription Initialization
   */
  async createSubscription(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { plan_id } = req.body;

      // Ensure Stripe publishable key is returned so Flutter can initialize PaymentSheet
      const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || ''; // Optional: expose this via a separate config endpoint instead

      const data = await subscriptionService.createMobileSubscription(userId, plan_id);
      
      apiResponse.success(res, {
        ...data,
        publishableKey
      }, 'Subscription initialized successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get my active subscription
   */
  async getMySubscription(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const data = await subscriptionService.getMySubscription(userId);
      apiResponse.success(res, data, 'Subscription retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Manage Subscription via Customer Portal (Upgrade, Downgrade, Cancel)
   */
  async manageSubscription(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { return_url } = req.body;
      const defaultReturnUrl = return_url || 'http://localhost:3000/dashboard/billing'; // Replace with env

      const data = await subscriptionService.getCustomerPortalUrl(userId, defaultReturnUrl);
      apiResponse.success(res, data, 'Customer portal session created successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const subscriptionController = new SubscriptionController();
