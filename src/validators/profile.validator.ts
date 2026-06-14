// ============================================
// Promoo Backend — Profile Validators
// ============================================

import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    full_name: z.string().min(2).optional(),
    username: z.string().min(3).optional(),
    bio: z.string().max(500).optional(),
    location: z.string().optional(),
    website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    category_id: z.string().uuid('Invalid category ID').optional(),
    social_links: z.record(z.string(), z.string().url('Invalid social URL')).optional(),
    
    // Type-specific details (validated conditionally in the service or here if needed)
    company_details: z.object({
      commercial_register: z.string().optional(),
      tax_number: z.string().optional(),
      industry: z.string().optional(),
      employees_count: z.string().optional(),
    }).optional(),
    
    influencer_details: z.object({
      main_platform: z.string().optional(),
      followers_count: z.string().optional(),
      niche: z.string().optional(),
    }).optional(),
    
    service_provider_details: z.object({
      services_offered: z.array(z.string()).optional(),
      years_of_experience: z.number().optional(),
      hourly_rate: z.number().optional(),
    }).optional(),
  }),
});

export const requestVerificationSchema = z.object({
  body: z.object({
    document_url: z.string().url('Invalid document URL'),
    notes: z.string().optional(),
  }),
});
