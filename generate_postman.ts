import * as fs from 'fs';
import * as path from 'path';

const collection = {
  info: {
    name: 'Promoo V1 Collection',
    description: 'Auto-generated collection for Promoo Backend with correct routes and bodies.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  variable: [
    { key: 'baseUrl', value: 'http://localhost:3000/api/v1', type: 'string' },
    { key: 'token', value: '', type: 'string' },
    { key: 'profileId', value: '', type: 'string' },
    { key: 'offerId', value: '', type: 'string' },
    { key: 'adId', value: '', type: 'string' },
    { key: 'roomId', value: '', type: 'string' },
    { key: 'categoryId', value: '', type: 'string' },
    { key: 'fileId', value: '', type: 'string' },
    { key: 'notificationId', value: '', type: 'string' },
    { key: 'reportId', value: '', type: 'string' }
  ],
  auth: {
    type: 'bearer',
    bearer: [
      { key: 'token', value: '{{token}}', type: 'string' }
    ]
  },
  item: [] as any[]
};

function createItem(name: string, method: string, pathUrl: string, bodyObj?: any, testScript?: string[]) {
  const urlParts = pathUrl.split('/').filter(Boolean);
  const request: any = {
    method,
    url: {
      raw: `{{baseUrl}}/${pathUrl}`,
      host: ['{{baseUrl}}'],
      path: urlParts
    }
  };

  if (bodyObj) {
    request.body = {
      mode: 'raw',
      raw: JSON.stringify(bodyObj, null, 2),
      options: { raw: { language: 'json' } }
    };
  }

  if (testScript && testScript.length > 0) {
    request.event = [
      {
        listen: 'test',
        script: {
          exec: testScript,
          type: 'text/javascript'
        }
      }
    ];
  }

  // To make it compatible with Postman Collection schema, event goes outside request.
  const item: any = { name, request };
  if (testScript && testScript.length > 0) {
    item.event = [
      {
        listen: 'test',
        script: {
          exec: testScript,
          type: 'text/javascript'
        }
      }
    ];
  }

  return item;
}

// 1. Auth
collection.item.push({
  name: '1. Auth',
  item: [
    createItem('Register Email', 'POST', 'auth/register/email', { email: 'test@example.com', password: 'password123', full_name: 'Test User', account_type: 'user' }),
    createItem('Register Phone', 'POST', 'auth/register/phone', { phone: '+963900000000', password: 'password123', full_name: 'Test User', account_type: 'user' }),
    createItem('Login Email', 'POST', 'auth/login/email', { email: 'test@example.com', password: 'password123' }, [
      "var jsonData = pm.response.json();",
      "if (jsonData.success && jsonData.data && jsonData.data.session) {",
      "    pm.collectionVariables.set('token', jsonData.data.session.access_token);",
      "}"
    ]),
    createItem('Login Phone', 'POST', 'auth/login/phone', { phone: '+963900000000', password: 'password123' }),
    createItem('OAuth', 'POST', 'auth/oauth', { provider: 'google', id_token: '...' }),
    createItem('Send OTP', 'POST', 'auth/otp/send', { email: 'test@example.com', type: 'signup' }),
    createItem('Verify OTP', 'POST', 'auth/otp/verify', { email: 'test@example.com', token: '123456', type: 'signup' }),
    createItem('Refresh Token', 'POST', 'auth/refresh', { refresh_token: '...' }),
    createItem('Logout', 'POST', 'auth/logout'),
    createItem('Forgot Password', 'POST', 'auth/password/forgot', { email: 'test@example.com' }),
    createItem('Reset Password', 'POST', 'auth/password/reset', { password: 'newpassword123' })
  ]
});

// 2. Profiles
collection.item.push({
  name: '2. Profiles',
  item: [
    createItem('Get My Profile', 'GET', 'profiles/me'),
    createItem('Update My Profile', 'PUT', 'profiles/me', { full_name: 'Updated Name', bio: 'New bio', avatar_url: '...' }),
    createItem('Get Profile by ID', 'GET', 'profiles/{{profileId}}'),
    createItem('Get Profile by Username', 'GET', 'profiles/username/someuser'),
    createItem('Get Profile Stats', 'GET', 'profiles/{{profileId}}/stats')
  ]
});

// 3. Follows
collection.item.push({
  name: '3. Follows',
  item: [
    createItem('Toggle Follow', 'POST', 'follows/{{profileId}}'),
    createItem('Get Followers', 'GET', 'follows/{{profileId}}/followers?page=1&limit=20'),
    createItem('Get Following', 'GET', 'follows/{{profileId}}/following?page=1&limit=20')
  ]
});

// 4. Offers
collection.item.push({
  name: '4. Offers',
  item: [
    createItem('Create Offer', 'POST', 'offers', { title: 'Sale', description: '50% off', discount_type: 'percentage', discount_value: 50, valid_until: '2026-12-31T00:00:00Z', category_id: '{{categoryId}}' }),
    createItem('Get Offers', 'GET', 'offers?page=1&limit=20'),
    createItem('Get My Offers', 'GET', 'offers/me?page=1&limit=20'),
    createItem('Get Offer by ID', 'GET', 'offers/{{offerId}}'),
    createItem('Update Offer', 'PUT', 'offers/{{offerId}}', { title: 'Updated Sale', is_active: false }),
    createItem('Delete Offer', 'DELETE', 'offers/{{offerId}}'),
    createItem('Redeem Offer', 'POST', 'offers/{{offerId}}/redeem'),
    createItem('Toggle Like Offer', 'POST', 'offers/{{offerId}}/like')
  ]
});

// 5. Ads
collection.item.push({
  name: '5. Ads',
  item: [
    createItem('Create Ad', 'POST', 'ads', { title: 'New Ad', description: 'Ad details', ad_type: 'banner', target_url: 'https://example.com' }),
    createItem('Get Ads', 'GET', 'ads?page=1&limit=20'),
    createItem('Get My Ads', 'GET', 'ads/me?page=1&limit=20'),
    createItem('Get Ad by ID', 'GET', 'ads/{{adId}}'),
    createItem('Update Ad', 'PUT', 'ads/{{adId}}', { title: 'Updated Ad', is_active: false }),
    createItem('Delete Ad', 'DELETE', 'ads/{{adId}}'),
    createItem('Track View', 'POST', 'ads/{{adId}}/view'),
    createItem('Toggle Like Ad', 'POST', 'ads/{{adId}}/like')
  ]
});

// 6. Subscriptions
collection.item.push({
  name: '6. Subscriptions',
  item: [
    createItem('Subscribe', 'POST', 'subscriptions/subscribe', { plan_id: '123' }),
    createItem('Get My Subscription', 'GET', 'subscriptions/my-subscription'),
    createItem('Cancel Subscription', 'POST', 'subscriptions/cancel')
  ]
});

// 7. Chats
collection.item.push({
  name: '7. Chats',
  item: [
    createItem('Create Chat Room', 'POST', 'chats', { participant_id: '{{profileId}}' }),
    createItem('Get My Chat Rooms', 'GET', 'chats?page=1&limit=20'),
    createItem('Get Messages in Room', 'GET', 'chats/{{roomId}}/messages?page=1&limit=50'),
    createItem('Send Message', 'POST', 'chats/{{roomId}}/messages', { content: 'Hello!' })
  ]
});

// 8. Notifications
collection.item.push({
  name: '8. Notifications',
  item: [
    createItem('Get My Notifications', 'GET', 'notifications?page=1&limit=20'),
    createItem('Register FCM Token', 'POST', 'notifications/token', { token: 'FCM_TOKEN_HERE', device_type: 'ios' }),
    createItem('Mark All as Read', 'PATCH', 'notifications/read-all'),
    createItem('Mark Notification as Read', 'PATCH', 'notifications/{{notificationId}}/read'),
    createItem('Delete Notification', 'DELETE', 'notifications/{{notificationId}}')
  ]
});

// 9. Upload & Search & Categories & Featured & Payments
collection.item.push({
  name: '9. General',
  item: [
    createItem('Upload Image (multipart)', 'POST', 'upload/image'),
    createItem('Upload Video (multipart)', 'POST', 'upload/video'),
    createItem('Upload File (multipart)', 'POST', 'upload/file'),
    createItem('Delete File', 'DELETE', 'upload/{{fileId}}'),
    createItem('Global Search', 'GET', 'search?query=test&type=all&page=1&limit=20'),
    createItem('Get Categories', 'GET', 'categories'),
    createItem('Get Category by ID', 'GET', 'categories/{{categoryId}}'),
    createItem('Get Featured Content', 'GET', 'featured?limit=10'),
    createItem('Get Payment History', 'GET', 'payments/history?page=1&limit=20'),
    createItem('Create Payment Intent', 'POST', 'payments/create-intent', { amount: 1000, currency: 'usd', description: 'Top up' }),
    createItem('Stripe Webhook', 'POST', 'webhook/stripe')
  ]
});

// 10. Reports
collection.item.push({
  name: '10. Reports',
  item: [
    createItem('Submit Report', 'POST', 'reports', { reported_id: '{{profileId}}', reported_type: 'profile', reason: 'Inappropriate content', details: 'More info' }),
    createItem('Get My Reports', 'GET', 'reports/me?page=1&limit=20')
  ]
});

// 11. Admin
collection.item.push({
  name: '11. Admin Dashboard',
  item: [
    createItem('Get Stats', 'GET', 'admin/stats'),
    createItem('Get Users', 'GET', 'admin/users?page=1&limit=20'),
    createItem('Update User Status', 'PATCH', 'admin/users/{{profileId}}/status', { is_active: false, reason: 'Violation' }),
    createItem('Delete User', 'DELETE', 'admin/users/{{profileId}}'),
    
    createItem('Get Content (Offers/Ads)', 'GET', 'admin/content?type=offer&page=1&limit=20'),
    createItem('Update Content Status', 'PATCH', 'admin/content/{{offerId}}/status', { is_active: false, type: 'offer' }),
    createItem('Delete Content', 'DELETE', 'admin/content/{{offerId}}?type=offer'),
    
    createItem('Create Plan', 'POST', 'admin/plans', { name: 'Pro', price: 9.99, duration_days: 30, features: {}, plan_type: 'subscription' }),
    createItem('Update Plan', 'PUT', 'admin/plans/123', { is_active: false }),
    createItem('Delete Plan', 'DELETE', 'admin/plans/123'),
    
    createItem('Get Payments', 'GET', 'admin/payments?page=1&limit=20'),
    
    createItem('Get Reports', 'GET', 'admin/reports?page=1&limit=20&status=pending'),
    createItem('Update Report Status', 'PATCH', 'admin/reports/{{reportId}}/status', { status: 'resolved', admin_note: 'Taken care of' }),
    
    createItem('Create Category', 'POST', 'admin/categories', { name_en: 'Tech', name_ar: 'تقنية', icon: '💻', is_active: true }),
    createItem('Update Category', 'PUT', 'admin/categories/{{categoryId}}', { name_en: 'Technology' }),
    createItem('Delete Category', 'DELETE', 'admin/categories/{{categoryId}}')
  ]
});

fs.writeFileSync(path.join(__dirname, 'promoo_postman_collection.json'), JSON.stringify(collection, null, 2));
console.log('Postman collection generated successfully!');
