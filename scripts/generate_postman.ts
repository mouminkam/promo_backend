/**
 * Generates promoo_postman_collection.json from the actual API route structure.
 * Run: npx tsx scripts/generate_postman.ts
 */

import * as fs from 'fs';
import * as path from 'path';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface QueryParam {
  key: string;
  value: string;
  disabled?: boolean;
}

interface PostmanRequest {
  name: string;
  method: HttpMethod;
  path: string;
  query?: QueryParam[];
  body?: object | 'formdata';
  formdata?: Array<{ key: string; value?: string; type: 'text' | 'file'; src?: string }>;
  noAuth?: boolean;
  tests?: string[];
}

interface PostmanFolder {
  name: string;
  items: Array<PostmanRequest | PostmanFolder>;
}

const BASE = '{{baseUrl}}';

function urlObject(reqPath: string, query?: QueryParam[]) {
  const segments = reqPath.split('/').filter(Boolean);
  const raw = query?.length
    ? `${BASE}/${segments.join('/')}?${query.map((q) => `${q.key}=${q.value}`).join('&')}`
    : `${BASE}/${segments.join('/')}`;

  return {
    raw,
    host: [BASE],
    path: segments,
    ...(query?.length ? { query } : {}),
  };
}

function makeRequest(req: PostmanRequest) {
  const item: Record<string, unknown> = {
    name: req.name,
    request: {
      method: req.method,
      header: req.body && req.body !== 'formdata'
        ? [{ key: 'Content-Type', value: 'application/json' }]
        : [],
      url: urlObject(req.path, req.query),
      ...(req.noAuth ? { auth: { type: 'noauth' } } : {}),
    },
  };

  if (req.body === 'formdata' && req.formdata) {
    (item.request as Record<string, unknown>).body = {
      mode: 'formdata',
      formdata: req.formdata,
    };
  } else if (req.body) {
    (item.request as Record<string, unknown>).body = {
      mode: 'raw',
      raw: JSON.stringify(req.body, null, 2),
      options: { raw: { language: 'json' } },
    };
  }

  if (req.tests?.length) {
    item.event = [
      {
        listen: 'test',
        script: { type: 'text/javascript', exec: req.tests },
      },
    ];
  }

  return item;
}

function makeFolder(folder: PostmanFolder) {
  return {
    name: folder.name,
    item: folder.items.map((entry) =>
      'items' in entry ? makeFolder(entry) : makeRequest(entry)
    ),
  };
}

const loginTestScript = [
  'var jsonData = pm.response.json();',
  "if (jsonData.success && jsonData.data) {",
  "  if (jsonData.data.session && jsonData.data.session.access_token) {",
  "    pm.collectionVariables.set('token', jsonData.data.session.access_token);",
  "  }",
  "  if (jsonData.data.access_token) {",
  "    pm.collectionVariables.set('token', jsonData.data.access_token);",
  "  }",
  "  if (jsonData.data.user && jsonData.data.user.id) {",
  "    pm.collectionVariables.set('userId', jsonData.data.user.id);",
  "  }",
  "  if (jsonData.data.profile && jsonData.data.profile.id) {",
  "    pm.collectionVariables.set('profileId', jsonData.data.profile.id);",
  "  }",
  '}',
];

const profileTestScript = [
  'var jsonData = pm.response.json();',
  "if (jsonData.success && jsonData.data && jsonData.data.id) {",
  "  pm.collectionVariables.set('profileId', jsonData.data.id);",
  '}',
];

const createOfferTestScript = [
  'var jsonData = pm.response.json();',
  "if (jsonData.success && jsonData.data && jsonData.data.id) {",
  "  pm.collectionVariables.set('offerId', jsonData.data.id);",
  '}',
];

const createAdTestScript = [
  'var jsonData = pm.response.json();',
  "if (jsonData.success && jsonData.data && jsonData.data.id) {",
  "  pm.collectionVariables.set('adId', jsonData.data.id);",
  '}',
];

const createChatTestScript = [
  'var jsonData = pm.response.json();',
  "if (jsonData.success && jsonData.data && jsonData.data.id) {",
  "  pm.collectionVariables.set('roomId', jsonData.data.id);",
  '}',
];

const createCategoryTestScript = [
  'var jsonData = pm.response.json();',
  "if (jsonData.success && jsonData.data && jsonData.data.id) {",
  "  pm.collectionVariables.set('categoryId', jsonData.data.id);",
  '}',
];

const createPlanTestScript = [
  'var jsonData = pm.response.json();',
  "if (jsonData.success && jsonData.data && jsonData.data.id) {",
  "  pm.collectionVariables.set('planId', jsonData.data.id);",
  '}',
];

const folders: PostmanFolder[] = [
  {
    name: '1. Auth',
    items: [
      {
        name: 'Register Email',
        method: 'POST',
        path: 'auth/register/email',
        noAuth: true,
        body: {
          email: 'test@example.com',
          password: 'password123',
          full_name: 'Test User',
          account_type: 'user',
        },
      },
      {
        name: 'Register Phone',
        method: 'POST',
        path: 'auth/register/phone',
        noAuth: true,
        body: {
          phone: '+963900000000',
          password: 'password123',
          full_name: 'Test User',
          account_type: 'user',
        },
      },
      {
        name: 'Login Email',
        method: 'POST',
        path: 'auth/login/email',
        noAuth: true,
        body: { email: 'test@example.com', password: 'password123' },
        tests: loginTestScript,
      },
      {
        name: 'Login Phone',
        method: 'POST',
        path: 'auth/login/phone',
        noAuth: true,
        body: { phone: '+963900000000', password: 'password123' },
        tests: loginTestScript,
      },
      {
        name: 'OAuth Login',
        method: 'POST',
        path: 'auth/login/oauth',
        noAuth: true,
        body: { provider: 'google', id_token: 'YOUR_ID_TOKEN_HERE' },
      },
      {
        name: 'Verify OTP',
        method: 'POST',
        path: 'auth/verify-otp',
        noAuth: true,
        body: { email: 'test@example.com', token: '123456', type: 'signup' },
        tests: loginTestScript,
      },
      {
        name: 'Refresh Token',
        method: 'POST',
        path: 'auth/refresh',
        noAuth: true,
        body: { refresh_token: '{{refreshToken}}' },
        tests: loginTestScript,
      },
      {
        name: 'Forgot Password',
        method: 'POST',
        path: 'auth/forgot-password',
        noAuth: true,
        body: { email: 'test@example.com' },
      },
      {
        name: 'Reset Password',
        method: 'POST',
        path: 'auth/reset-password',
        body: { password: 'newpassword123' },
      },
      {
        name: 'Logout',
        method: 'POST',
        path: 'auth/logout',
      },
      {
        name: 'Delete Account',
        method: 'DELETE',
        path: 'auth/account',
      },
    ],
  },
  {
    name: '2. Profiles',
    items: [
      { name: 'Get My Profile', method: 'GET', path: 'profiles/me', tests: profileTestScript },
      {
        name: 'Update My Profile',
        method: 'PUT',
        path: 'profiles/me',
        body: { full_name: 'Updated Name', bio: 'New bio text here', username: 'testuser' },
      },
      {
        name: 'Update Avatar',
        method: 'POST',
        path: 'profiles/me/avatar',
        body: { avatar_url: 'https://example.com/avatar.png' },
      },
      {
        name: 'Update Cover',
        method: 'POST',
        path: 'profiles/me/cover',
        body: { cover_url: 'https://example.com/cover.png' },
      },
      {
        name: 'Request Verification',
        method: 'POST',
        path: 'profiles/me/verify-request',
        body: { document_url: 'https://example.com/doc.pdf', notes: 'Please verify my account' },
      },
      { name: 'Get Profile by ID/Username', method: 'GET', path: 'profiles/{{profileId}}', noAuth: true },
      { name: 'Get Profile Media', method: 'GET', path: 'profiles/{{profileId}}/media', noAuth: true },
    ],
  },
  {
    name: '3. Follows',
    items: [
      { name: 'Follow Profile', method: 'POST', path: 'follows/{{profileId}}' },
      { name: 'Unfollow Profile', method: 'DELETE', path: 'follows/{{profileId}}' },
      { name: 'Check Follow Status', method: 'GET', path: 'follows/{{profileId}}/status' },
      {
        name: 'Get Followers',
        method: 'GET',
        path: 'follows/followers/{{profileId}}',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
      {
        name: 'Get Following',
        method: 'GET',
        path: 'follows/following/{{profileId}}',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
    ],
  },
  {
    name: '4. Offers',
    items: [
      {
        name: 'Get All Offers',
        method: 'GET',
        path: 'offers',
        noAuth: true,
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
          { key: 'search', value: '', disabled: true },
          { key: 'category_id', value: '{{categoryId}}', disabled: true },
        ],
      },
      { name: 'Get Offer by ID', method: 'GET', path: 'offers/{{offerId}}', noAuth: true },
      {
        name: 'Get Offers by Profile',
        method: 'GET',
        path: 'offers/profile/{{profileId}}',
        noAuth: true,
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
      {
        name: 'Create Offer',
        method: 'POST',
        path: 'offers',
        body: {
          category_id: '{{categoryId}}',
          title: 'Summer Sale',
          description: 'This is a detailed description of the summer sale offer.',
          original_price: 100,
          offer_price: 50,
          discount_percentage: 50,
          media_urls: ['https://example.com/offer.jpg'],
          start_date: '2026-06-01T00:00:00.000Z',
          end_date: '2026-12-31T23:59:59.000Z',
          status: 'active',
        },
        tests: createOfferTestScript,
      },
      {
        name: 'Update Offer',
        method: 'PUT',
        path: 'offers/{{offerId}}',
        body: { title: 'Updated Summer Sale', description: 'Updated description for the offer.' },
      },
      { name: 'Delete Offer', method: 'DELETE', path: 'offers/{{offerId}}' },
      { name: 'Feature Offer', method: 'POST', path: 'offers/{{offerId}}/feature' },
    ],
  },
  {
    name: '5. Ads & Services',
    items: [
      { name: 'Get All Services', method: 'GET', path: 'services', noAuth: true },
      {
        name: 'Create Service',
        method: 'POST',
        path: 'services',
        body: {
          category_id: '{{categoryId}}',
          title: 'Professional Logo Design',
          description: 'High quality custom logo design for your brand identity.',
          price: 500,
          currency: 'AED',
          delivery_days: 3,
          media_urls: ['https://example.com/service.jpg'],
          tags: ['design', 'logo'],
        },
      },
      { name: 'Get Service Details', method: 'GET', path: 'services/{{serviceId}}', noAuth: true },
      { name: 'Update Service', method: 'PUT', path: 'services/{{serviceId}}', body: { price: 600 } },
      { name: 'Delete Service', method: 'DELETE', path: 'services/{{serviceId}}' },
      { name: 'Get Active Ads', method: 'GET', path: 'ads/active', noAuth: true },
      { name: 'Record Impression', method: 'POST', path: 'ads/{{adId}}/impression', noAuth: true },
      { name: 'Record Click', method: 'POST', path: 'ads/{{adId}}/click', noAuth: true },
      {
        name: 'Create Ad',
        method: 'POST',
        path: 'ads',
        body: {
          title: 'New Banner Ad',
          description: 'Promotional banner for summer campaign',
          media_url: 'https://example.com/ad-banner.jpg',
          ad_type: 'banner',
          target_url: 'https://example.com',
          budget: 100,
          start_date: '2026-06-01T00:00:00.000Z',
          end_date: '2026-12-31T23:59:59.000Z',
          phone: '+963900000000',
          city: 'Dubai',
          tags: ['promo'],
        },
        tests: createAdTestScript,
      },
      {
        name: 'Update Ad',
        method: 'PUT',
        path: 'ads/{{adId}}',
        body: { title: 'Updated Banner Ad', budget: 150 },
      },
      { name: 'Toggle Ad Active', method: 'PATCH', path: 'ads/{{adId}}/toggle' },
      { name: 'Get Ad Stats', method: 'GET', path: 'ads/{{adId}}/stats' },
      {
        name: 'Get Profile Ads',
        method: 'GET',
        path: 'ads/profile/{{profileId}}',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
    ],
  },
  {
    name: '6. Subscriptions',
    items: [
      { name: 'Get Plans', method: 'GET', path: 'subscriptions/plans', noAuth: true },
      {
        name: 'Create Subscription',
        method: 'POST',
        path: 'subscriptions',
        body: { plan_id: '{{planId}}', return_url: 'http://localhost:3000/dashboard/billing' },
      },
      { name: 'Get My Subscription', method: 'GET', path: 'subscriptions/me' },
      {
        name: 'Manage Subscription',
        method: 'POST',
        path: 'subscriptions/manage',
        body: { return_url: 'http://localhost:3000/dashboard/billing' },
      },
    ],
  },
  {
    name: '7. Chats',
    items: [
      {
        name: 'Get Chats',
        method: 'GET',
        path: 'chats',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
      {
        name: 'Create Chat',
        method: 'POST',
        path: 'chats',
        body: { participant_id: '{{profileId}}' },
        tests: createChatTestScript,
      },
      {
        name: 'Get Messages',
        method: 'GET',
        path: 'chats/{{roomId}}/messages',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '50' },
        ],
      },
      {
        name: 'Send Message',
        method: 'POST',
        path: 'chats/{{roomId}}/messages',
        body: { content: 'Hello!', type: 'text' },
      },
      { name: 'Mark Messages Read', method: 'PATCH', path: 'chats/{{roomId}}/read' },
      { name: 'Delete Chat', method: 'DELETE', path: 'chats/{{roomId}}' },
    ],
  },
  {
    name: '8. Notifications',
    items: [
      {
        name: 'Get My Notifications',
        method: 'GET',
        path: 'notifications',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
      { name: 'Mark All as Read', method: 'PATCH', path: 'notifications/read-all' },
      { name: 'Mark Notification as Read', method: 'PATCH', path: 'notifications/{{notificationId}}/read' },
      { name: 'Delete Notification', method: 'DELETE', path: 'notifications/{{notificationId}}' },
      {
        name: 'Register FCM Token',
        method: 'POST',
        path: 'notifications/token',
        body: { token: 'FCM_TOKEN_HERE', device_type: 'ios' },
      },
    ],
  },
  {
    name: '9. General & Home',
    items: [
      { name: 'Health Check', method: 'GET', path: 'health', noAuth: true },
      { name: 'Get Home Feed', method: 'GET', path: 'home', noAuth: true },
      { name: 'Get Active Stories', method: 'GET', path: 'stories', noAuth: true },
      { name: 'Get User Stories', method: 'GET', path: 'stories/user/{{userId}}', noAuth: true },
      { name: 'Get My Stories', method: 'GET', path: 'stories/me' },
      { name: 'Create Story', method: 'POST', path: 'stories', body: { media_url: 'https://example.com/story.mp4' } },
      { name: 'Delete Story', method: 'DELETE', path: 'stories/{{storyId}}' },
      {
        name: 'Get Available Seats',
        method: 'GET',
        path: 'seats',
        noAuth: true,
        query: [{ key: 'tier', value: 'gold', disabled: true }],
      },
      { name: 'Get My Seats', method: 'GET', path: 'seats/me' },
      { name: 'Book Seat', method: 'POST', path: 'seats/{{seatId}}/book' },
      { name: 'Cancel Seat', method: 'DELETE', path: 'seats/{{seatId}}/cancel' },
      { name: 'Get Saved Items', method: 'GET', path: 'saved' },
      { name: 'Save Item', method: 'POST', path: 'saved', body: { item_id: '{{offerId}}', item_type: 'offer' } },
      { name: 'Unsave Item', method: 'DELETE', path: 'saved/{{savedItemId}}' },
      {
        name: 'Global Search',
        method: 'GET',
        path: 'search',
        noAuth: true,
        query: [
          { key: 'q', value: 'test' },
          { key: 'type', value: 'all' },
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
      { name: 'Get Categories', method: 'GET', path: 'categories', noAuth: true },
      {
        name: 'Get Category Content',
        method: 'GET',
        path: 'categories/{{categoryId}}/content',
        noAuth: true,
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
      {
        name: 'Get Featured Content',
        method: 'GET',
        path: 'featured',
        noAuth: true,
        query: [
          { key: 'placement', value: 'home' },
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
      {
        name: 'Request Featured',
        method: 'POST',
        path: 'featured',
        body: { placement: 'home', duration_days: 7 },
      },
      {
        name: 'Upload Image',
        method: 'POST',
        path: 'upload/image',
        body: 'formdata',
        formdata: [
          { key: 'file', type: 'file', src: '' },
          { key: 'related_to', value: 'offer', type: 'text' },
          { key: 'related_id', value: '{{offerId}}', type: 'text' },
        ],
      },
      {
        name: 'Upload Video',
        method: 'POST',
        path: 'upload/video',
        body: 'formdata',
        formdata: [
          { key: 'file', type: 'file', src: '' },
          { key: 'related_to', value: 'offer', type: 'text' },
          { key: 'related_id', value: '{{offerId}}', type: 'text' },
        ],
      },
      {
        name: 'Upload File',
        method: 'POST',
        path: 'upload/file',
        body: 'formdata',
        formdata: [
          { key: 'file', type: 'file', src: '' },
          { key: 'related_to', value: 'chat', type: 'text' },
          { key: 'related_id', value: '{{roomId}}', type: 'text' },
        ],
      },
      { name: 'Delete File', method: 'DELETE', path: 'upload/{{fileId}}' },
      {
        name: 'Get Payments History',
        method: 'GET',
        path: 'payments/history',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
      { name: 'Create Customer Portal', method: 'POST', path: 'payments/portal' },
      { name: 'Get Payment Details', method: 'GET', path: 'payments/{{paymentId}}' },
      {
        name: 'Stripe Webhook',
        method: 'POST',
        path: 'webhooks/stripe',
        noAuth: true,
        body: { type: 'checkout.session.completed', data: { object: {} } },
      },
    ],
  },
  {
    name: '10. Reports',
    items: [
      {
        name: 'Submit Report',
        method: 'POST',
        path: 'reports',
        body: {
          reported_id: '{{profileId}}',
          reported_type: 'profile',
          reason: 'spam content',
          details: 'Optional additional details about the report',
        },
      },
      {
        name: 'Get My Reports',
        method: 'GET',
        path: 'reports/me',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
    ],
  },
  {
    name: '11. Admin',
    items: [
      { name: 'Get Global Stats', method: 'GET', path: 'admin/stats' },
      {
        name: 'Create Category',
        method: 'POST',
        path: 'admin/categories',
        body: {
          name_en: 'Technology',
          name_ar: 'تقنية',
          icon_url: 'https://example.com/icons/tech.png',
        },
        tests: createCategoryTestScript,
      },
      {
        name: 'Update Category',
        method: 'PUT',
        path: 'admin/categories/{{categoryId}}',
        body: { name_en: 'Tech & Innovation' },
      },
      { name: 'Delete Category', method: 'DELETE', path: 'admin/categories/{{categoryId}}' },
      {
        name: 'Update Offer Status',
        method: 'PATCH',
        path: 'admin/content/offers/{{offerId}}/status',
        body: { status: 'rejected' },
      },
      { name: 'Delete Offer (Admin)', method: 'DELETE', path: 'admin/content/offers/{{offerId}}' },
      {
        name: 'Update Ad Status',
        method: 'PATCH',
        path: 'admin/content/ads/{{adId}}/status',
        body: { status: 'active' },
      },
      { name: 'Delete Ad (Admin)', method: 'DELETE', path: 'admin/content/ads/{{adId}}' },
      { name: 'Get Admin Plans', method: 'GET', path: 'admin/plans' },
      {
        name: 'Create Plan',
        method: 'POST',
        path: 'admin/plans',
        body: {
          stripe_price_id: 'price_1234567890',
          name_en: 'Pro Plan',
          name_ar: 'الخطة الاحترافية',
          description_en: 'Full access to all features',
          description_ar: 'وصول كامل لجميع الميزات',
          price: 9.99,
          currency: 'aed',
          interval: 'monthly',
          features_en: ['Unlimited offers', 'Priority support'],
          features_ar: ['عروض غير محدودة', 'دعم أولوية'],
          is_active: true,
        },
        tests: createPlanTestScript,
      },
      {
        name: 'Update Plan',
        method: 'PUT',
        path: 'admin/plans/{{planId}}',
        body: { is_active: false },
      },
      { name: 'Delete Plan', method: 'DELETE', path: 'admin/plans/{{planId}}' },
      {
        name: 'Get Users',
        method: 'GET',
        path: 'admin/users',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
      { name: 'Get User Details', method: 'GET', path: 'admin/users/{{userId}}' },
      {
        name: 'Toggle User Ban',
        method: 'PATCH',
        path: 'admin/users/{{userId}}/ban',
        body: { isActive: false },
      },
      {
        name: 'Toggle User Verify',
        method: 'PATCH',
        path: 'admin/users/{{userId}}/verify',
        body: { isVerified: true },
      },
      { name: 'Delete User', method: 'DELETE', path: 'admin/users/{{userId}}' },
      {
        name: 'Get All Reports',
        method: 'GET',
        path: 'admin/reports',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
          { key: 'status', value: 'pending', disabled: true },
        ],
      },
      {
        name: 'Update Report Status',
        method: 'PATCH',
        path: 'admin/reports/{{reportId}}/status',
        body: { status: 'resolved', admin_note: 'Issue has been addressed' },
      },
      {
        name: 'Get Admin Payments',
        method: 'GET',
        path: 'admin/payments',
        query: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      },
    ],
  },
];

function countRequests(items: Array<PostmanRequest | PostmanFolder>): number {
  return items.reduce((sum, item) => {
    if ('items' in item) return sum + countRequests(item.items);
    return sum + 1;
  }, 0);
}

const collection = {
  info: {
    name: 'Promoo API Collection',
    description:
      'Complete Postman collection for Promoo Backend. Auto-generated from src/routes. Import into Postman, set baseUrl if needed, run Login Email first to capture token.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    _postman_id: 'promoo-backend-v1',
  },
  variable: [
    { key: 'baseUrl', value: 'http://localhost:3000/api/v1', type: 'string' },
    { key: 'token', value: '', type: 'string' },
    { key: 'refreshToken', value: '', type: 'string' },
    { key: 'profileId', value: '', type: 'string' },
    { key: 'userId', value: '', type: 'string' },
    { key: 'offerId', value: '', type: 'string' },
    { key: 'adId', value: '', type: 'string' },
    { key: 'roomId', value: '', type: 'string' },
    { key: 'messageId', value: '', type: 'string' },
    { key: 'categoryId', value: '', type: 'string' },
    { key: 'fileId', value: '', type: 'string' },
    { key: 'notificationId', value: '', type: 'string' },
    { key: 'reportId', value: '', type: 'string' },
    { key: 'planId', value: '', type: 'string' },
    { key: 'paymentId', value: '', type: 'string' },
    { key: 'serviceId', value: '', type: 'string' },
    { key: 'seatId', value: '', type: 'string' },
    { key: 'storyId', value: '', type: 'string' },
    { key: 'savedItemId', value: '', type: 'string' },
  ],
  auth: {
    type: 'bearer',
    bearer: [{ key: 'token', value: '{{token}}', type: 'string' }],
  },
  item: folders.map(makeFolder),
};

const outputPath = path.join(__dirname, '..', 'promoo_postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf-8');

const total = countRequests(folders);
console.log(`✅ Generated ${outputPath}`);
console.log(`   Folders: ${folders.length}`);
console.log(`   Requests: ${total}`);
