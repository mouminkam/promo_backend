/**
 * Full API capture — logs in every role, exercises every endpoint in
 * dependency order against the running server, captures the REAL response,
 * and writes organized markdown into docs/Apis-Resaults/<Folder>/<Folder>.md
 *
 * Run: DISABLE_RATE_LIMIT=true npx tsx src/server.ts   (in another shell)
 *      npx tsx scripts/run_full_api_capture.ts
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const BASE = 'http://localhost:3000/api/v1';
const OUT_DIR = path.join(process.cwd(), 'docs', 'Apis-Resaults');
const TEST_PASSWORD = 'Promoo@Test2026';

const admin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

interface Entry {
  name: string;
  method: string;
  route: string;
  auth: string;
  payload: any;
  status: number | string;
  response: any;
}
const results: Record<string, Entry[]> = {};
function record(folder: string, e: Entry) {
  (results[folder] ||= []).push(e);
}

type CallOpts = {
  folder: string;
  name: string;
  method: string;
  apiPath: string;          // e.g. /saved  (without baseUrl)
  token?: string;
  authLabel?: string;
  body?: any;
  form?: FormData;
};

async function call(o: CallOpts): Promise<{ status: number; json: any }> {
  const headers: Record<string, string> = {};
  if (o.token) headers['Authorization'] = `Bearer ${o.token}`;
  let bodyToSend: any;
  if (o.form) {
    bodyToSend = o.form; // fetch sets multipart boundary
  } else if (o.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    bodyToSend = JSON.stringify(o.body);
  }
  let status: number | string = 'ERR';
  let json: any = null;
  try {
    const res = await fetch(`${BASE}${o.apiPath}`, { method: o.method, headers, body: bodyToSend });
    status = res.status;
    const text = await res.text();
    try { json = JSON.parse(text); } catch { json = text; }
  } catch (err: any) {
    json = { error: String(err?.message || err) };
  }
  record(o.folder, {
    name: o.name,
    method: o.method,
    route: `{{baseUrl}}${o.apiPath}`,
    auth: o.authLabel || (o.token ? 'Bearer' : 'Public (no auth)'),
    payload: o.form ? '(multipart/form-data — file upload)' : (o.body ?? null),
    status,
    response: json,
  });
  return { status: status as number, json };
}

async function getTokenFor(email: string): Promise<string> {
  const res = await fetch(`${BASE}/auth/login/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: TEST_PASSWORD }),
  });
  const j = await res.json();
  if (!j?.data?.session?.access_token) throw new Error(`Login failed for ${email}: ${JSON.stringify(j)}`);
  return j.data.session.access_token;
}

function tinyPng(): Buffer {
  // 1x1 transparent PNG
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64'
  );
}

async function main() {
  console.log('→ Mapping users & setting known test passwords...');
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (listErr) throw listErr;
  const byEmail: Record<string, string> = {};
  for (const u of list.users) if (u.email) byEmail[u.email] = u.id;

  const accounts = {
    company: 'company@test.com',
    influencer: 'influencer@test.com',
    provider: 'provider@test.com',
    user: 'user@test.com',
    admin: 'mo2min.2001@gmail.com',
  };
  for (const email of Object.values(accounts)) {
    const id = byEmail[email];
    if (!id) { console.warn(`  ! missing account ${email}`); continue; }
    await admin.auth.admin.updateUserById(id, { password: TEST_PASSWORD });
  }

  const companyId = byEmail[accounts.company];
  const influencerId = byEmail[accounts.influencer];

  console.log('→ Logging in roles...');
  const companyToken = await getTokenFor(accounts.company);
  const influencerToken = await getTokenFor(accounts.influencer);
  const providerToken = await getTokenFor(accounts.provider);
  const userToken = await getTokenFor(accounts.user);
  const adminToken = await getTokenFor(accounts.admin);

  // ---------------- HEALTH ----------------
  await call({ folder: 'Health', name: 'Health Check', method: 'GET', apiPath: '/health' });

  // ---------------- AUTH ----------------
  const freshEmail = `apitest_${Date.now()}@example.com`;
  await call({ folder: 'Auth', name: 'Register (Email)', method: 'POST', apiPath: '/auth/register/email',
    body: { email: freshEmail, password: TEST_PASSWORD, full_name: 'API Test User', account_type: 'company' } });
  await call({ folder: 'Auth', name: 'Register (Phone)', method: 'POST', apiPath: '/auth/register/phone',
    body: { phone: `+9715${Math.floor(10000000 + Math.random() * 89999999)}`, password: TEST_PASSWORD, full_name: 'API Test Phone', account_type: 'influencer' } });
  await call({ folder: 'Auth', name: 'Login (Email)', method: 'POST', apiPath: '/auth/login/email',
    body: { email: accounts.company, password: TEST_PASSWORD }, authLabel: 'Public (no auth)' });
  // Create a throwaway phone-confirmed user so Login (Phone) exercises the real success path
  const phoneNum = `+9715${Math.floor(10000000 + Math.random() * 89999999)}`;
  let phoneUserId = '';
  try { const { data: pu } = await admin.auth.admin.createUser({ phone: phoneNum, password: TEST_PASSWORD, phone_confirm: true }); phoneUserId = pu?.user?.id || ''; } catch {}
  await call({ folder: 'Auth', name: 'Login (Phone)', method: 'POST', apiPath: '/auth/login/phone',
    body: { phone: phoneNum, password: TEST_PASSWORD }, authLabel: 'Public (no auth)' });
  if (phoneUserId) { try { await admin.auth.admin.deleteUser(phoneUserId); } catch {} }
  await call({ folder: 'Auth', name: 'Login (OAuth)', method: 'POST', apiPath: '/auth/login/oauth',
    body: { provider: 'google', id_token: 'fake_id_token_for_testing', nonce: 'test-nonce' } });
  await call({ folder: 'Auth', name: 'Verify OTP', method: 'POST', apiPath: '/auth/verify-otp',
    body: { phone: '+971500000000', token: '123456', type: 'sms' } });

  // real refresh token from a fresh company login
  const compLoginRes = await fetch(`${BASE}/auth/login/email`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: accounts.company, password: TEST_PASSWORD }) });
  const compLoginJson = await compLoginRes.json();
  const refreshToken = compLoginJson?.data?.session?.refresh_token;
  await call({ folder: 'Auth', name: 'Refresh Token', method: 'POST', apiPath: '/auth/refresh',
    body: { refresh_token: refreshToken }, authLabel: 'Public (no auth)' });

  await call({ folder: 'Auth', name: 'Forgot Password', method: 'POST', apiPath: '/auth/forgot-password',
    body: { email: accounts.company } });
  // Reset Password via a throwaway confirmed user — changing a password revokes
  // ALL of that user's sessions, so we must NOT use the shared company session here.
  const resetEmail = `apitest_reset_${Date.now()}@example.com`;
  const { data: resetUser } = await admin.auth.admin.createUser({ email: resetEmail, password: TEST_PASSWORD, email_confirm: true });
  let resetToken = '';
  try { resetToken = await getTokenFor(resetEmail); } catch {}
  await call({ folder: 'Auth', name: 'Reset Password', method: 'POST', apiPath: '/auth/reset-password',
    token: resetToken, authLabel: 'Bearer (throwaway user)', body: { password: 'NewPassword123!' } });
  if (resetUser?.user?.id) { try { await admin.auth.admin.deleteUser(resetUser.user.id); } catch {} }

  await call({ folder: 'Auth', name: 'Logout', method: 'POST', apiPath: '/auth/logout',
    token: userToken, authLabel: 'Bearer (throwaway session)' });

  // Delete account via a throwaway confirmed user
  const delEmail = `apitest_delete_${Date.now()}@example.com`;
  const { data: delUser } = await admin.auth.admin.createUser({ email: delEmail, password: TEST_PASSWORD, email_confirm: true });
  let delToken = '';
  try { delToken = await getTokenFor(delEmail); } catch {}
  await call({ folder: 'Auth', name: 'Delete Account', method: 'DELETE', apiPath: '/auth/account',
    token: delToken, authLabel: 'Bearer (throwaway user)' });
  if (delUser?.user?.id) { try { await admin.auth.admin.deleteUser(delUser.user.id); } catch {} }

  // re-login user (was logged out above)
  const userToken2 = await getTokenFor(accounts.user);

  // ---------------- PROFILES ----------------
  await call({ folder: 'Profiles', name: 'Get My Profile', method: 'GET', apiPath: '/profiles/me', token: companyToken, authLabel: 'Bearer (company)' });
  await call({ folder: 'Profiles', name: 'Update My Profile', method: 'PUT', apiPath: '/profiles/me', token: companyToken, authLabel: 'Bearer (company)',
    body: { bio: 'Leading marketing agency in Dubai.', location: 'Dubai, UAE', website: 'https://promoo.example.com' } });
  await call({ folder: 'Profiles', name: 'Update Avatar', method: 'POST', apiPath: '/profiles/me/avatar', token: companyToken, authLabel: 'Bearer (company)',
    body: { avatar_url: 'https://example.com/avatar.jpg' } });
  await call({ folder: 'Profiles', name: 'Update Cover', method: 'POST', apiPath: '/profiles/me/cover', token: companyToken, authLabel: 'Bearer (company)',
    body: { cover_url: 'https://example.com/cover.jpg' } });
  await call({ folder: 'Profiles', name: 'Request Verification', method: 'POST', apiPath: '/profiles/me/verify-request', token: companyToken, authLabel: 'Bearer (company)',
    body: { document_url: 'https://example.com/license.pdf', notes: 'Trade license attached.' } });
  await call({ folder: 'Profiles', name: 'Get Profile by ID', method: 'GET', apiPath: `/profiles/${influencerId}` });
  await call({ folder: 'Profiles', name: 'Get Profile Media', method: 'GET', apiPath: `/profiles/${influencerId}/media` });

  // ---------------- FOLLOWS ----------------
  await call({ folder: 'Follows', name: 'Follow Profile', method: 'POST', apiPath: `/follows/${influencerId}`, token: companyToken, authLabel: 'Bearer (company)' });
  await call({ folder: 'Follows', name: 'Check Follow Status', method: 'GET', apiPath: `/follows/${influencerId}/status`, token: companyToken, authLabel: 'Bearer (company)' });
  await call({ folder: 'Follows', name: 'Get Followers', method: 'GET', apiPath: `/follows/followers/${influencerId}?page=1&limit=20`, token: companyToken, authLabel: 'Bearer (company)' });
  await call({ folder: 'Follows', name: 'Get Following', method: 'GET', apiPath: `/follows/following/${companyId}?page=1&limit=20`, token: companyToken, authLabel: 'Bearer (company)' });
  await call({ folder: 'Follows', name: 'Unfollow Profile', method: 'DELETE', apiPath: `/follows/${influencerId}`, token: companyToken, authLabel: 'Bearer (company)' });

  // ---------------- OFFERS ----------------
  const offerBody = {
    category_id: process.env.TEST_CATEGORY_ID || '20361ed2-ab58-427a-ad12-a8ace962b09f',
    title: '50% Off Summer Collection',
    description: 'Limited time discount on all summer items, valid in-store and online.',
    original_price: 200, offer_price: 100, discount_percentage: 50,
    media_urls: ['https://example.com/offer1.jpg'],
    start_date: '2026-07-01T00:00:00.000Z', end_date: '2026-08-01T00:00:00.000Z',
    status: 'active', tags: ['summer', 'sale'],
  };
  const offerCreate = await call({ folder: 'Offers', name: 'Create Offer', method: 'POST', apiPath: '/offers', token: companyToken, authLabel: 'Bearer (company, required: company/service_provider)', body: offerBody });
  const offerId = offerCreate.json?.data?.id;
  await call({ folder: 'Offers', name: 'List Offers', method: 'GET', apiPath: '/offers?page=1&limit=20' });
  await call({ folder: 'Offers', name: 'Get Offer by ID', method: 'GET', apiPath: `/offers/${offerId}` });
  await call({ folder: 'Offers', name: 'Get Offers by Profile', method: 'GET', apiPath: `/offers/profile/${companyId}?page=1&limit=20` });
  await call({ folder: 'Offers', name: 'Update Offer', method: 'PUT', apiPath: `/offers/${offerId}`, token: companyToken, authLabel: 'Bearer (company)', body: { title: '60% Off Summer Collection', offer_price: 80 } });
  await call({ folder: 'Offers', name: 'Feature Offer (Stripe Checkout)', method: 'POST', apiPath: `/offers/${offerId}/feature`, token: companyToken, authLabel: 'Bearer (company)' });
  // delete capture via throwaway offer
  const offer2 = await call({ folder: 'Offers', name: 'Delete Offer (setup throwaway)', method: 'POST', apiPath: '/offers', token: companyToken, authLabel: 'Bearer (company)', body: { ...offerBody, title: 'Throwaway Offer To Delete' } });
  const offer2Id = offer2.json?.data?.id;
  // remove the setup entry from the folder so only the DELETE shows for clarity
  results['Offers'] = results['Offers'].filter((e) => e.name !== 'Delete Offer (setup throwaway)');
  await call({ folder: 'Offers', name: 'Delete Offer', method: 'DELETE', apiPath: `/offers/${offer2Id}`, token: companyToken, authLabel: 'Bearer (company)' });

  // ---------------- ADS ----------------
  const adBody = {
    title: 'Grand Opening Sale', description: 'Visit our new branch this weekend.',
    media_url: 'https://example.com/ad-banner.jpg', ad_type: 'banner', target_url: 'https://example.com',
    budget: 500, start_date: '2026-07-01T00:00:00.000Z', end_date: '2026-07-15T00:00:00.000Z',
    phone: '+971500000000', contact_email: 'ads@example.com', city: 'Dubai', price: 99, currency: 'AED', tags: ['opening'],
  };
  const adCreate = await call({ folder: 'Ads', name: 'Create Ad', method: 'POST', apiPath: '/ads', token: companyToken, authLabel: 'Bearer (company, required: company/influencer)', body: adBody });
  const adId = adCreate.json?.data?.id;
  // New ads default to status 'pending'. Activate it (admin) so impression/click/toggle
  // exercise the real success path instead of the correct-but-noisy "Ad is not active".
  if (adId) { try { await admin.from('ads').update({ status: 'active' }).eq('id', adId); } catch {} }
  await call({ folder: 'Ads', name: 'Get Active Ads', method: 'GET', apiPath: '/ads/active' });
  await call({ folder: 'Ads', name: 'Record Impression', method: 'POST', apiPath: `/ads/${adId}/impression` });
  await call({ folder: 'Ads', name: 'Record Click', method: 'POST', apiPath: `/ads/${adId}/click` });
  await call({ folder: 'Ads', name: 'Update Ad', method: 'PUT', apiPath: `/ads/${adId}`, token: companyToken, authLabel: 'Bearer (company)', body: { title: 'Extended Grand Opening Sale' } });
  await call({ folder: 'Ads', name: 'Toggle Ad', method: 'PATCH', apiPath: `/ads/${adId}/toggle`, token: companyToken, authLabel: 'Bearer (company)' });
  await call({ folder: 'Ads', name: 'Get Ad Stats', method: 'GET', apiPath: `/ads/${adId}/stats`, token: companyToken, authLabel: 'Bearer (company)' });
  await call({ folder: 'Ads', name: 'Get Ads by Profile', method: 'GET', apiPath: `/ads/profile/${companyId}`, token: companyToken, authLabel: 'Bearer (company)' });

  // ---------------- SERVICES ----------------
  const serviceBody = {
    category_id: offerBody.category_id, title: 'Professional Logo Design',
    description: 'Custom logo design with unlimited revisions.', price: 350, currency: 'AED',
    delivery_days: 5, media_urls: ['https://example.com/portfolio.jpg'], tags: ['design'],
  };
  const svcCreate = await call({ folder: 'Services', name: 'Create Service', method: 'POST', apiPath: '/services', token: providerToken, authLabel: 'Bearer (provider, required: service_provider/company)', body: serviceBody });
  const serviceId = svcCreate.json?.data?.id;
  await call({ folder: 'Services', name: 'List Services', method: 'GET', apiPath: '/services' });
  await call({ folder: 'Services', name: 'Get Service by ID', method: 'GET', apiPath: `/services/${serviceId}` });
  await call({ folder: 'Services', name: 'Update Service', method: 'PUT', apiPath: `/services/${serviceId}`, token: providerToken, authLabel: 'Bearer (provider)', body: { price: 400, delivery_days: 7 } });
  await call({ folder: 'Services', name: 'Delete Service', method: 'DELETE', apiPath: `/services/${serviceId}`, token: providerToken, authLabel: 'Bearer (provider)' });

  // ---------------- SEATS (CUP) ----------------
  const seatId = process.env.TEST_SEAT_ID || '6168c692-ae96-4af7-8695-281a2395783c';
  await call({ folder: 'Seats (Cup)', name: 'Get Seats', method: 'GET', apiPath: '/seats?tier=gold' });
  await call({ folder: 'Seats (Cup)', name: 'Get My Seats', method: 'GET', apiPath: '/seats/me', token: influencerToken, authLabel: 'Bearer (influencer)' });
  await call({ folder: 'Seats (Cup)', name: 'Book Seat (Stripe Checkout)', method: 'POST', apiPath: `/seats/${seatId}/book`, token: influencerToken, authLabel: 'Bearer (influencer)' });
  await call({ folder: 'Seats (Cup)', name: 'Cancel Seat', method: 'DELETE', apiPath: `/seats/${seatId}/cancel`, token: influencerToken, authLabel: 'Bearer (influencer)' });

  // ---------------- STORIES ----------------
  const storyCreate = await call({ folder: 'Stories', name: 'Create Story', method: 'POST', apiPath: '/stories', token: influencerToken, authLabel: 'Bearer (influencer)', body: { media_url: 'https://example.com/story.jpg' } });
  const storyId = storyCreate.json?.data?.id;
  await call({ folder: 'Stories', name: 'Get Active Stories', method: 'GET', apiPath: '/stories' });
  await call({ folder: 'Stories', name: 'Get User Stories', method: 'GET', apiPath: `/stories/user/${influencerId}` });
  await call({ folder: 'Stories', name: 'Get My Stories', method: 'GET', apiPath: '/stories/me', token: influencerToken, authLabel: 'Bearer (influencer)' });
  await call({ folder: 'Stories', name: 'Delete Story', method: 'DELETE', apiPath: `/stories/${storyId}`, token: influencerToken, authLabel: 'Bearer (influencer)' });

  // ---------------- SAVED ITEMS ----------------
  const saveCreate = await call({ folder: 'Saved Items', name: 'Save Item', method: 'POST', apiPath: '/saved', token: userToken2, authLabel: 'Bearer (user)', body: { item_id: offerId, item_type: 'offer' } });
  const savedItemId = saveCreate.json?.data?.id;
  await call({ folder: 'Saved Items', name: 'Get Saved Items', method: 'GET', apiPath: '/saved', token: userToken2, authLabel: 'Bearer (user)' });
  await call({ folder: 'Saved Items', name: 'Unsave Item', method: 'DELETE', apiPath: `/saved/${savedItemId}`, token: userToken2, authLabel: 'Bearer (user)' });

  // ---------------- HOME & LEADERBOARD ----------------
  await call({ folder: 'Home & Leaderboard', name: 'Get Home Feed', method: 'GET', apiPath: '/home' });
  await call({ folder: 'Home & Leaderboard', name: 'Get Leaderboard (Cup)', method: 'GET', apiPath: '/leaderboard?page=1&limit=20&type=all' });

  // ---------------- SUBSCRIPTIONS ----------------
  const planId = process.env.TEST_PLAN_ID || 'a951eaab-66db-4e58-a843-f08709741ec1';
  await call({ folder: 'Subscriptions', name: 'Get Plans', method: 'GET', apiPath: '/subscriptions/plans' });
  await call({ folder: 'Subscriptions', name: 'Create Subscription (Stripe)', method: 'POST', apiPath: '/subscriptions', token: userToken2, authLabel: 'Bearer (user)', body: { plan_id: planId } });
  await call({ folder: 'Subscriptions', name: 'Get My Subscription', method: 'GET', apiPath: '/subscriptions/me', token: userToken2, authLabel: 'Bearer (user)' });
  await call({ folder: 'Subscriptions', name: 'Manage Subscription (Portal)', method: 'POST', apiPath: '/subscriptions/manage', token: userToken2, authLabel: 'Bearer (user)', body: { return_url: 'https://example.com/billing' } });

  // ---------------- CHATS ----------------
  const chatStart = await call({ folder: 'Chats', name: 'Start Chat', method: 'POST', apiPath: '/chats', token: companyToken, authLabel: 'Bearer (company)', body: { participant_id: influencerId } });
  const roomId = chatStart.json?.data?.room?.id || chatStart.json?.data?.id || chatStart.json?.data?.room_id;
  await call({ folder: 'Chats', name: 'Get Chat List', method: 'GET', apiPath: '/chats?page=1&limit=20', token: companyToken, authLabel: 'Bearer (company)' });
  await call({ folder: 'Chats', name: 'Send Message', method: 'POST', apiPath: `/chats/${roomId}/messages`, token: companyToken, authLabel: 'Bearer (company)', body: { content: 'Hello, is this offer still available?', type: 'text' } });
  await call({ folder: 'Chats', name: 'Get Messages', method: 'GET', apiPath: `/chats/${roomId}/messages?page=1&limit=20`, token: companyToken, authLabel: 'Bearer (company)' });
  await call({ folder: 'Chats', name: 'Mark as Read', method: 'PATCH', apiPath: `/chats/${roomId}/read`, token: influencerToken, authLabel: 'Bearer (influencer)' });
  await call({ folder: 'Chats', name: 'Delete Chat', method: 'DELETE', apiPath: `/chats/${roomId}`, token: companyToken, authLabel: 'Bearer (company)' });

  // ---------------- NOTIFICATIONS ----------------
  await call({ folder: 'Notifications', name: 'Register FCM Token', method: 'POST', apiPath: '/notifications/token', token: companyToken, authLabel: 'Bearer (company)', body: { token: 'fcm_test_token_123', device_type: 'android' } });
  // influencer likely has a "new follower" notification
  const inNotifs = await call({ folder: 'Notifications', name: 'Get Notifications', method: 'GET', apiPath: '/notifications?page=1&limit=20', token: influencerToken, authLabel: 'Bearer (influencer)' });
  const notifId = inNotifs.json?.data?.[0]?.id;
  await call({ folder: 'Notifications', name: 'Mark All as Read', method: 'PATCH', apiPath: '/notifications/read-all', token: influencerToken, authLabel: 'Bearer (influencer)' });
  if (notifId) {
    await call({ folder: 'Notifications', name: 'Mark One as Read', method: 'PATCH', apiPath: `/notifications/${notifId}/read`, token: influencerToken, authLabel: 'Bearer (influencer)' });
    await call({ folder: 'Notifications', name: 'Delete Notification', method: 'DELETE', apiPath: `/notifications/${notifId}`, token: influencerToken, authLabel: 'Bearer (influencer)' });
  } else {
    const fakeNotif = '00000000-0000-0000-0000-000000000000';
    await call({ folder: 'Notifications', name: 'Mark One as Read', method: 'PATCH', apiPath: `/notifications/${fakeNotif}/read`, token: influencerToken, authLabel: 'Bearer (influencer)' });
    await call({ folder: 'Notifications', name: 'Delete Notification', method: 'DELETE', apiPath: `/notifications/${fakeNotif}`, token: influencerToken, authLabel: 'Bearer (influencer)' });
  }

  // ---------------- UPLOAD ----------------
  const png = tinyPng();
  const imgForm = new FormData();
  imgForm.append('file', new Blob([png], { type: 'image/png' }), 'test.png');
  imgForm.append('related_to', 'profile');
  imgForm.append('bucket', 'avatars');
  const imgUp = await call({ folder: 'Upload', name: 'Upload Image', method: 'POST', apiPath: '/upload/image', token: companyToken, authLabel: 'Bearer (company)', form: imgForm });
  const fileId = imgUp.json?.data?.id;

  const vidForm = new FormData();
  vidForm.append('file', new Blob([Buffer.from('00000000', 'hex')], { type: 'video/mp4' }), 'test.mp4');
  vidForm.append('related_to', 'story');
  vidForm.append('bucket', 'stories');
  await call({ folder: 'Upload', name: 'Upload Video', method: 'POST', apiPath: '/upload/video', token: companyToken, authLabel: 'Bearer (company)', form: vidForm });

  const docForm = new FormData();
  docForm.append('file', new Blob([Buffer.from('%PDF-1.4 test', 'utf8')], { type: 'application/pdf' }), 'test.pdf');
  docForm.append('related_to', 'verification');
  docForm.append('bucket', 'verifications');
  await call({ folder: 'Upload', name: 'Upload File', method: 'POST', apiPath: '/upload/file', token: companyToken, authLabel: 'Bearer (company)', form: docForm });

  await call({ folder: 'Upload', name: 'Delete File', method: 'DELETE', apiPath: `/upload/${fileId || '00000000-0000-0000-0000-000000000000'}`, token: companyToken, authLabel: 'Bearer (company)' });

  // ---------------- SEARCH & CATEGORIES ----------------
  await call({ folder: 'Search & Categories', name: 'Search', method: 'GET', apiPath: '/search?q=design&type=all&page=1&limit=20' });
  await call({ folder: 'Search & Categories', name: 'Get Categories', method: 'GET', apiPath: '/categories' });
  await call({ folder: 'Search & Categories', name: 'Get Category Content', method: 'GET', apiPath: `/categories/${offerBody.category_id}/content?page=1&limit=20` });

  // ---------------- FEATURED ----------------
  await call({ folder: 'Featured', name: 'Get Featured Listings', method: 'GET', apiPath: '/featured?page=1&limit=20' });
  await call({ folder: 'Featured', name: 'Request Featured', method: 'POST', apiPath: '/featured', token: companyToken, authLabel: 'Bearer (company)', body: { placement: 'home', duration_days: 30 } });

  // ---------------- PAYMENTS ----------------
  // Insert a real payment row for the user so history + details return real records.
  let realPaymentId = '';
  try {
    const { data: payRow } = await admin.from('payments').insert({
      profile_id: byEmail[accounts.user], stripe_payment_id: `pi_test_${Date.now()}`,
      amount: 99, type: 'subscription', status: 'succeeded', metadata: {},
    }).select('id').single();
    realPaymentId = payRow?.id || '';
  } catch {}
  await call({ folder: 'Payments', name: 'Get Payment History', method: 'GET', apiPath: '/payments/history?page=1&limit=20', token: userToken2, authLabel: 'Bearer (user)' });
  await call({ folder: 'Payments', name: 'Create Customer Portal Session', method: 'POST', apiPath: '/payments/portal', token: userToken2, authLabel: 'Bearer (user)' });
  await call({ folder: 'Payments', name: 'Get Payment Details', method: 'GET', apiPath: `/payments/${realPaymentId || '00000000-0000-0000-0000-000000000000'}`, token: userToken2, authLabel: 'Bearer (user)' });
  if (realPaymentId) { try { await admin.from('payments').delete().eq('id', realPaymentId); } catch {} }

  // ---------------- REPORTS ----------------
  const repCreate = await call({ folder: 'Reports', name: 'Create Report', method: 'POST', apiPath: '/reports', token: userToken2, authLabel: 'Bearer (user)', body: { reported_id: influencerId, reported_type: 'profile', reason: 'Spam content', details: 'Repeated spam offers.' } });
  const reportId = repCreate.json?.data?.id;
  await call({ folder: 'Reports', name: 'Get My Reports', method: 'GET', apiPath: '/reports/me', token: userToken2, authLabel: 'Bearer (user)' });

  // ---------------- ADMIN ----------------
  await call({ folder: 'Admin', name: 'Get Global Stats', method: 'GET', apiPath: '/admin/stats', token: adminToken, authLabel: 'Bearer (admin)' });
  await call({ folder: 'Admin', name: 'Get Users', method: 'GET', apiPath: '/admin/users?page=1&limit=20', token: adminToken, authLabel: 'Bearer (admin)' });
  await call({ folder: 'Admin', name: 'Get User Details', method: 'GET', apiPath: `/admin/users/${influencerId}`, token: adminToken, authLabel: 'Bearer (admin)' });
  const userTestId = byEmail[accounts.user];
  await call({ folder: 'Admin', name: 'Toggle Ban', method: 'PATCH', apiPath: `/admin/users/${userTestId}/ban`, token: adminToken, authLabel: 'Bearer (admin)', body: { isActive: false } });
  await admin.from('profiles').update({ is_active: true }).eq('id', userTestId); // restore
  await call({ folder: 'Admin', name: 'Toggle Verify', method: 'PATCH', apiPath: `/admin/users/${userTestId}/verify`, token: adminToken, authLabel: 'Bearer (admin)', body: { isVerified: true } });
  await admin.from('profiles').update({ is_verified: false }).eq('id', userTestId); // restore
  // delete user via throwaway
  const delEmail2 = `apitest_admindel_${Date.now()}@example.com`;
  const { data: delUser2 } = await admin.auth.admin.createUser({ email: delEmail2, password: TEST_PASSWORD, email_confirm: true });
  await call({ folder: 'Admin', name: 'Delete User', method: 'DELETE', apiPath: `/admin/users/${delUser2?.user?.id}`, token: adminToken, authLabel: 'Bearer (admin)' });

  await call({ folder: 'Admin', name: 'Update Offer Status', method: 'PATCH', apiPath: `/admin/content/offers/${offerId}/status`, token: adminToken, authLabel: 'Bearer (admin)', body: { status: 'active' } });
  await call({ folder: 'Admin', name: 'Update Ad Status', method: 'PATCH', apiPath: `/admin/content/ads/${adId}/status`, token: adminToken, authLabel: 'Bearer (admin)', body: { status: 'active' } });
  // admin delete content via throwaways
  const offer3 = await fetch(`${BASE}/offers`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${companyToken}` }, body: JSON.stringify({ ...offerBody, title: 'Admin Delete Target' }) }).then(r => r.json());
  await call({ folder: 'Admin', name: 'Delete Offer (Admin)', method: 'DELETE', apiPath: `/admin/content/offers/${offer3?.data?.id}`, token: adminToken, authLabel: 'Bearer (admin)' });
  const ad3 = await fetch(`${BASE}/ads`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${companyToken}` }, body: JSON.stringify({ ...adBody, title: 'Admin Delete Ad' }) }).then(r => r.json());
  await call({ folder: 'Admin', name: 'Delete Ad (Admin)', method: 'DELETE', apiPath: `/admin/content/ads/${ad3?.data?.id}`, token: adminToken, authLabel: 'Bearer (admin)' });

  await call({ folder: 'Admin', name: 'Get Plans (Admin)', method: 'GET', apiPath: '/admin/plans', token: adminToken, authLabel: 'Bearer (admin)' });
  const planCreate = await call({ folder: 'Admin', name: 'Create Plan', method: 'POST', apiPath: '/admin/plans', token: adminToken, authLabel: 'Bearer (admin)', body: { stripe_price_id: `price_test_${Date.now()}`, name_ar: 'باقة اختبار', name_en: 'Test Plan', price: 199, currency: 'aed', interval: 'monthly', features_ar: ['ميزة'], features_en: ['Feature'], is_active: true } });
  const newPlanId = planCreate.json?.data?.id;
  await call({ folder: 'Admin', name: 'Update Plan', method: 'PUT', apiPath: `/admin/plans/${newPlanId}`, token: adminToken, authLabel: 'Bearer (admin)', body: { price: 249 } });
  await call({ folder: 'Admin', name: 'Delete Plan', method: 'DELETE', apiPath: `/admin/plans/${newPlanId}`, token: adminToken, authLabel: 'Bearer (admin)' });

  await call({ folder: 'Admin', name: 'Get Payments (Admin)', method: 'GET', apiPath: '/admin/payments?page=1&limit=20', token: adminToken, authLabel: 'Bearer (admin)' });
  await call({ folder: 'Admin', name: 'Get Reports (Admin)', method: 'GET', apiPath: '/admin/reports?page=1&limit=20', token: adminToken, authLabel: 'Bearer (admin)' });
  if (reportId) {
    await call({ folder: 'Admin', name: 'Update Report Status', method: 'PATCH', apiPath: `/admin/reports/${reportId}/status`, token: adminToken, authLabel: 'Bearer (admin)', body: { status: 'resolved', admin_note: 'Reviewed and resolved.' } });
  }
  const catCreate = await call({ folder: 'Admin', name: 'Create Category', method: 'POST', apiPath: '/admin/categories', token: adminToken, authLabel: 'Bearer (admin)', body: { name_ar: 'تصنيف اختبار', name_en: 'Test Category', icon_url: 'https://example.com/icon.png' } });
  const newCatId = catCreate.json?.data?.id;
  await call({ folder: 'Admin', name: 'Update Category', method: 'PUT', apiPath: `/admin/categories/${newCatId}`, token: adminToken, authLabel: 'Bearer (admin)', body: { name_en: 'Test Category Updated' } });
  await call({ folder: 'Admin', name: 'Delete Category', method: 'DELETE', apiPath: `/admin/categories/${newCatId}`, token: adminToken, authLabel: 'Bearer (admin)' });

  // ---------------- WEBHOOKS ----------------
  await call({ folder: 'Webhooks', name: 'Stripe Webhook (no signature)', method: 'POST', apiPath: '/webhooks/stripe', body: { id: 'evt_test', type: 'checkout.session.completed', data: { object: {} } } });

  // ---------------- CLEANUP ----------------
  console.log('→ Cleanup: removing main test offer/ad, releasing seat...');
  if (offerId) { try { await admin.from('offers').delete().eq('id', offerId); } catch {} }
  if (adId) { try { await admin.from('ads').delete().eq('id', adId); } catch {} }
  try { await admin.from('seats').update({ status: 'available', influencer_id: null, expires_at: null }).eq('id', seatId); } catch {}

  // ---------------- WRITE FILES ----------------
  writeMarkdown();
  console.log('✓ Done. Files written to docs/Apis-Resaults/');
}

function jsonBlock(v: any): string {
  if (v === null || v === undefined) return '_— none —_';
  if (typeof v === 'string') return v.startsWith('(multipart') ? `_${v}_` : '```json\n' + JSON.stringify(v) + '\n```';
  return '```json\n' + JSON.stringify(v, null, 2) + '\n```';
}

function writeMarkdown() {
  const order = [
    'Health', 'Auth', 'Profiles', 'Follows', 'Offers', 'Ads', 'Services', 'Seats (Cup)',
    'Stories', 'Saved Items', 'Home & Leaderboard', 'Subscriptions', 'Chats', 'Notifications',
    'Upload', 'Search & Categories', 'Featured', 'Payments', 'Reports', 'Admin', 'Webhooks',
  ];
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  let idx = 1;
  for (const folder of order) {
    const entries = results[folder];
    if (!entries || !entries.length) continue;
    const folderNum = String(idx).padStart(2, '0');
    const safe = folder.replace(/[\\/:*?"<>|]/g, '');
    const dir = path.join(OUT_DIR, `${folderNum} - ${safe}`);
    fs.mkdirSync(dir, { recursive: true });
    let md = `# ${folder} — API Test Results\n\n> Live responses captured against \`${BASE}\`. Base URL shown as \`{{baseUrl}}\`.\n\n`;
    entries.forEach((e, i) => {
      const ok = typeof e.status === 'number' && e.status >= 200 && e.status < 300;
      md += `## ${i + 1}. ${e.name}\n\n`;
      md += `- **Method / Route:** \`${e.method} ${e.route}\`\n`;
      md += `- **Auth:** ${e.auth}\n`;
      md += `- **Status:** \`${e.status}\` ${ok ? '✅' : '⚠️'}\n\n`;
      md += `**Payload:**\n\n${jsonBlock(e.payload)}\n\n`;
      md += `**Response:**\n\n${jsonBlock(e.response)}\n\n`;
      md += `---\n\n`;
    });
    fs.writeFileSync(path.join(dir, `${safe}.md`), md, 'utf8');
    idx++;
  }
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });
