// ============================================
// Promoo Backend — Enums & Constants
// ============================================

/** Account types available in the platform */
export enum AccountType {
  Company = 'company',
  Influencer = 'influencer',
  ServiceProvider = 'service_provider',
  User = 'user',
}

/** Offer statuses */
export enum OfferStatus {
  Draft = 'draft',
  Active = 'active',
  Expired = 'expired',
  Rejected = 'rejected',
}

/** Ad types */
export enum AdType {
  Banner = 'banner',
  Popup = 'popup',
  Featured = 'featured',
}

/** Ad statuses */
export enum AdStatus {
  Pending = 'pending',
  Active = 'active',
  Paused = 'paused',
  Completed = 'completed',
  Rejected = 'rejected',
}

/** Subscription statuses (mirrors Stripe) */
export enum SubscriptionStatus {
  Active = 'active',
  PastDue = 'past_due',
  Canceled = 'canceled',
  Trialing = 'trialing',
}

/** Subscription intervals */
export enum SubscriptionInterval {
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Yearly = 'yearly',
}

/** Message types in chat */
export enum MessageType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  File = 'file',
}

/** Chat room types */
export enum ChatRoomType {
  Direct = 'direct',
}

/** Notification types */
export enum NotificationType {
  Follow = 'follow',
  Message = 'message',
  Offer = 'offer',
  System = 'system',
  Payment = 'payment',
}

/** Report types (what is being reported) */
export enum ReportedType {
  Profile = 'profile',
  Offer = 'offer',
  Ad = 'ad',
  Message = 'message',
}

/** Report resolution statuses */
export enum ReportStatus {
  Pending = 'pending',
  Reviewed = 'reviewed',
  Resolved = 'resolved',
  Dismissed = 'dismissed',
}

/** Payment types */
export enum PaymentType {
  Subscription = 'subscription',
  Ad = 'ad',
  Featured = 'featured',
}

/** Payment statuses */
export enum PaymentStatus {
  Succeeded = 'succeeded',
  Pending = 'pending',
  Failed = 'failed',
  Refunded = 'refunded',
}

/** Featured placement positions */
export enum FeaturedPlacement {
  Home = 'home',
  Search = 'search',
  Category = 'category',
}

/** Supported languages */
export enum Language {
  Arabic = 'ar',
  English = 'en',
}

/** Media relation targets */
export enum MediaRelation {
  Profile = 'profile',
  Offer = 'offer',
  Ad = 'ad',
  Chat = 'chat',
}

/** API Error Codes */
export enum ErrorCode {
  // Auth
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_MISSING = 'TOKEN_MISSING',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Resources
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Payment
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
}
