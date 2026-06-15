// ============================================
// Promoo Backend — Notification Service
// ============================================

import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import { messaging } from '../config/firebase';
import { logger } from '../utils/logger';

export class NotificationService {
  /**
   * Get notifications for the current user
   */
  async getNotifications(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const { count } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', userId);

    const total = count || 0;

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw ApiError.internal(error.message);
    }

    return {
      data: data || [],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(userId: string, notificationId: string) {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('profile_id', userId);

    if (error) {
      throw ApiError.internal(error.message);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('profile_id', userId)
      .eq('is_read', false);

    if (error) {
      throw ApiError.internal(error.message);
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(userId: string, notificationId: string) {
    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('profile_id', userId);

    if (error) {
      throw ApiError.internal(error.message);
    }
  }

  /**
   * Register FCM Token for push notifications
   */
  async registerToken(userId: string, token: string, deviceType?: string) {
    // Check if token already exists for this user to avoid unique constraint errors on upsert
    const { data: existingToken } = await supabaseAdmin
      .from('fcm_tokens')
      .select('id')
      .eq('token', token)
      .maybeSingle();

    if (existingToken) {
      // If it exists, make sure it belongs to the current user
      const { error } = await supabaseAdmin
        .from('fcm_tokens')
        .update({ profile_id: userId, device_type: deviceType || null })
        .eq('token', token);

      if (error) throw ApiError.internal(error.message);
    } else {
      // Insert new token
      const { error } = await supabaseAdmin
        .from('fcm_tokens')
        .insert({
          profile_id: userId,
          token,
          device_type: deviceType || null,
        });

      if (error) throw ApiError.internal(error.message);
    }
  }

  /**
   * Send a Push Notification to a user via FCM and optionally create an in-app record.
   * Internal method used by other services.
   */
  async sendNotification(
    userId: string,
    title: string,
    body: string,
    type: 'follow' | 'message' | 'offer' | 'system' | 'payment',
    dataObj?: Record<string, any>,
    createInAppRecord: boolean = true
  ) {
    try {
      // 1. Create in-app notification if requested
      if (createInAppRecord) {
        await supabaseAdmin.from('notifications').insert({
          profile_id: userId,
          title,
          body,
          type,
          data: dataObj || {},
        });
      }

      // 2. Fetch user's FCM tokens
      const { data: tokens } = await supabaseAdmin
        .from('fcm_tokens')
        .select('token')
        .eq('profile_id', userId);

      if (!tokens || tokens.length === 0) return;

      const fcmTokens = tokens.map((t) => t.token);

      // Convert dataObj values to strings for FCM
      const fcmData: Record<string, string> = { type };
      if (dataObj) {
        for (const [key, value] of Object.entries(dataObj)) {
          if (value !== undefined && value !== null) {
            fcmData[key] = String(value);
          }
        }
      }

      // 3. Send via Firebase Admin
      const message = {
        notification: { title, body },
        data: fcmData,
        tokens: fcmTokens,
      };

      const response = await messaging.sendEachForMulticast(message);

      // Cleanup invalid tokens
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const errCode = resp.error?.code;
            if (
              errCode === 'messaging/invalid-registration-token' ||
              errCode === 'messaging/registration-token-not-registered'
            ) {
              failedTokens.push(fcmTokens[idx]);
            }
          }
        });

        if (failedTokens.length > 0) {
          await supabaseAdmin.from('fcm_tokens').delete().in('token', failedTokens);
        }
      }
    } catch (error: any) {
      logger.error(`Failed to send notification to user ${userId}: ${error.message}`);
    }
  }
}

export const notificationService = new NotificationService();
