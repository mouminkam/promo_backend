// ============================================
// Promoo Backend — Upload Service
// ============================================

import { supabaseAdmin } from '../config/supabase';
import { ApiError } from '../utils/apiError';
import crypto from 'crypto';

type BucketName = 'avatars' | 'covers' | 'offers' | 'ads' | 'chat-media' | 'services' | 'stories' | 'verifications' | 'reports' | 'general';
type RelatedTo = 'profile' | 'offer' | 'ad' | 'chat' | 'service' | 'story' | 'report' | 'verification';

export class UploadService {
  /**
   * Upload a file to Supabase Storage and track it in the DB
   */
  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    bucket: BucketName,
    relatedTo?: RelatedTo,
    relatedId?: string
  ): Promise<Record<string, unknown>> {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    // Store files organized by userId folder inside the bucket
    const filePath = `${userId}/${fileName}`;

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw ApiError.internal(`Failed to upload to storage: ${uploadError.message}`);
    }

    // 2. Get Public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Create record in `media` table
    const { data: mediaRecord, error: dbError } = await supabaseAdmin
      .from('media')
      .insert({
        profile_id: userId,
        file_name: fileName,
        file_url: publicUrl,
        file_type: file.mimetype,
        file_size: file.size,
        related_to: relatedTo || null,
        related_id: relatedId || null,
      })
      .select()
      .single();

    if (dbError) {
      // Rollback: Cleanup storage if DB insert fails
      await supabaseAdmin.storage.from(bucket).remove([filePath]);
      throw ApiError.internal(`Failed to save media record: ${dbError.message}`);
    }

    return mediaRecord;
  }

  /**
   * Delete a file from Storage and DB
   */
  async deleteFile(userId: string, fileId: string): Promise<void> {
    // 1. Get the media record
    const { data: media, error: fetchError } = await supabaseAdmin
      .from('media')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fetchError || !media) {
      throw ApiError.notFound('File not found');
    }

    // 2. Check ownership
    if (media.profile_id !== userId) {
      throw ApiError.forbidden('You do not have permission to delete this file');
    }

    // Extract bucket and file path from the URL
    // Public URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[filepath]
    const urlParts = media.file_url.split('/public/');
    if (urlParts.length !== 2) {
      throw ApiError.internal('Invalid file URL format');
    }

    const pathParts = urlParts[1].split('/');
    const bucket = pathParts[0];
    const filePath = pathParts.slice(1).join('/');

    // 3. Delete from Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath]);

    if (storageError) {
      // Just log it but don't fail, maybe it was already deleted manually
      console.warn(`Failed to delete file from storage: ${storageError.message}`);
    }

    // 4. Delete from DB
    const { error: dbError } = await supabaseAdmin
      .from('media')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      throw ApiError.internal(dbError.message);
    }
  }
}

export const uploadService = new UploadService();
