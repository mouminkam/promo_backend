/**
 * Scans all Promoo APIs and saves every response to JSON + HTML reports.
 *
 * Usage:
 *   1. Start server:  npm run dev
 *   2. Run scan:      npm run api:scan
 *      Or double-click: run-api-scan.bat
 *
 * Env (optional, in .env):
 *   API_SCAN_BASE_URL=http://localhost:3000/api/v1
 *   API_SCAN_EMAIL=test1@example.com
 *   API_SCAN_PASSWORD=password123
 */

import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ResultStatus = 'pass' | 'fail' | 'skip' | 'expected_fail';

interface ScanResult {
  folder: string;
  name: string;
  method: HttpMethod;
  url: string;
  status: ResultStatus;
  httpStatus: number | null;
  durationMs: number;
  requestBody: unknown;
  responseBody: unknown;
  note?: string;
}

interface PostmanUrl {
  raw?: string;
  path?: string[];
  query?: Array<{ key: string; value: string; disabled?: boolean }>;
}

interface PostmanItem {
  name: string;
  item?: PostmanItem[];
  request?: {
    method: HttpMethod;
    url: PostmanUrl | string;
    body?: {
      mode: string;
      raw?: string;
      formdata?: Array<{ key: string; value?: string; type: string }>;
    };
    auth?: { type: string };
  };
}

const BASE_URL = process.env.API_SCAN_BASE_URL || 'http://localhost:3000/api/v1';
const TEST_EMAIL = process.env.API_SCAN_EMAIL || 'test1@example.com';
const TEST_PASSWORD = process.env.API_SCAN_PASSWORD || 'password123';
const ADMIN_EMAIL = process.env.API_SCAN_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.API_SCAN_ADMIN_PASSWORD || '';

const SKIP_NAMES = new Set(['Delete Account', 'Delete User', 'Logout']);
const OPTIONAL_NAMES = new Set([
  'Register Email',
  'Register Phone',
  'OAuth Login',
  'Verify OTP',
  'Refresh Token',
  'Stripe Webhook',
  'Reset Password',
  'Follow Profile',
  'Create Chat',
  'Feature Offer',
  'Create Subscription',
  'Request Featured',
  'Delete Offer',
  'Delete Offer (Admin)',
  'Delete Ad (Admin)',
  'Delete Category',
  'Delete Plan',
  'Delete Chat',
  'Delete File',
  'Delete Notification',
]);

const REPORT_DIR = path.join(__dirname, '..', 'docs', 'api-reports');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function interpolate(value: string, vars: Record<string, string>): string {
  return value.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}

function interpolateObject(obj: unknown, vars: Record<string, string>): unknown {
  if (typeof obj === 'string') return interpolate(obj, vars);
  if (Array.isArray(obj)) return obj.map((v) => interpolateObject(v, vars));
  if (obj && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = interpolateObject(v, vars);
    return out;
  }
  return obj;
}

function hasUnresolvedVars(value: string): string | null {
  const match = value.match(/\{\{(\w+)\}\}/);
  return match ? match[1] : null;
}

function buildUrl(item: PostmanItem, vars: Record<string, string>): string {
  const req = item.request!;
  const url = req.url;

  if (typeof url === 'string') {
    return interpolate(url.replace('{{baseUrl}}', BASE_URL), vars);
  }

  const segments = (url.path || []).map((p) => interpolate(p, vars));
  const base = `${BASE_URL}/${segments.join('/')}`;
  const activeQuery = (url.query || []).filter((q) => !q.disabled && q.value !== '');
  if (!activeQuery.length) return base;

  const qs = activeQuery
    .map((q) => `${encodeURIComponent(q.key)}=${encodeURIComponent(interpolate(q.value, vars))}`)
    .join('&');
  return `${base}?${qs}`;
}

function getRequestBody(item: PostmanItem, vars: Record<string, string>): unknown | 'formdata' {
  const body = item.request?.body;
  if (!body) return undefined;
  if (body.mode === 'raw' && body.raw) {
    try {
      return JSON.parse(interpolate(body.raw, vars));
    } catch {
      return interpolate(body.raw, vars);
    }
  }
  if (body.mode === 'formdata') return 'formdata';
  return undefined;
}

function extractVars(name: string, response: unknown, vars: Record<string, string>) {
  const json = response as {
    success?: boolean;
    data?: Record<string, unknown> & { id?: string; session?: { access_token?: string }; user?: { id?: string }; profile?: { id?: string } };
  };
  if (!json?.success || !json.data) return;

  const data = json.data;

  if (data.session?.access_token) vars.token = data.session.access_token;
  if (typeof data.access_token === 'string') vars.token = data.access_token;
  if (data.user?.id) vars.userId = data.user.id;
  if (data.profile?.id) vars.profileId = data.profile.id;

  if (data.id) {
    const id = data.id;
    if (name === 'Create Offer') vars.offerId = id;
    else if (name === 'Create Ad') vars.adId = id;
    else if (name === 'Create Chat') vars.roomId = id;
    else if (name === 'Create Category') vars.categoryId = id;
    else if (name === 'Create Plan') vars.planId = id;
    else if (name === 'Submit Report') vars.reportId = id;
  }

  if (name === 'Get Categories' && Array.isArray(data) && data[0]?.id) {
    vars.categoryId = String(data[0].id);
  }
  if (name === 'Get Plans' && Array.isArray(data) && data[0]?.id) {
    vars.planId = String(data[0].id);
  }
  if (name === 'Get Admin Plans' && Array.isArray(data) && data[0]?.id) {
    vars.planId = String(data[0].id);
  }
  if (name === 'Get My Notifications' && Array.isArray(data) && data[0]?.id) {
    vars.notificationId = String(data[0].id);
  }
  if (name === 'Get Payments History' && Array.isArray(data) && data[0]?.id) {
    vars.paymentId = String(data[0].id);
  }
  if (name === 'Get All Reports' && Array.isArray(data) && data[0]?.id) {
    vars.reportId = String(data[0].id);
  }
  if (name === 'Get Users' && Array.isArray(data) && data[0]?.id) {
    vars.userId = String(data[0].id);
  }
  if (name === 'Login Email' && data.session?.refresh_token) {
    vars.refreshToken = data.session.refresh_token as string;
  }
}

function overrideBody(name: string, body: unknown): unknown {
  if (name === 'Login Email') return { email: TEST_EMAIL, password: TEST_PASSWORD };
  if (name === 'Forgot Password') return { email: TEST_EMAIL };
  if (name === 'Verify OTP') return { email: TEST_EMAIL, token: '000000', type: 'signup' };
  if (name === 'Register Email') {
    const ts = Date.now();
    return {
      email: `scan_${ts}@example.com`,
      password: TEST_PASSWORD,
      full_name: 'API Scan User',
      account_type: 'user',
    };
  }
  return body;
}

async function executeRequest(
  item: PostmanItem,
  vars: Record<string, string>,
  folder: string
): Promise<{ httpStatus: number; body: unknown; durationMs: number }> {
  const method = item.request!.method;
  const url = buildUrl(item, vars);
  const noAuth = item.request?.auth?.type === 'noauth';
  const useAdminToken = folder.includes('Admin') && !!vars.adminToken;
  let body = getRequestBody(item, vars);
  body = overrideBody(item.name, body);

  const headers: Record<string, string> = {};
  if (!noAuth) {
    const token = useAdminToken ? vars.adminToken : vars.token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const start = Date.now();
  let response: Response;

  if (body === 'formdata') {
    const form = new FormData();
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );
    form.append('file', new Blob([png], { type: 'image/png' }), 'scan-test.png');
    form.append('related_to', 'offer');
    if (vars.offerId) form.append('related_id', vars.offerId);
    response = await fetch(url, { method, headers, body: form });
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
  } else {
    response = await fetch(url, { method, headers });
  }

  const durationMs = Date.now() - start;
  const text = await response.text();
  let parsed: unknown = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  return { httpStatus: response.status, body: parsed, durationMs };
}

function classifyResult(name: string, httpStatus: number, folder: string, hasAdminToken: boolean): ResultStatus {
  if (httpStatus >= 200 && httpStatus < 300) return 'pass';
  if (folder.includes('Admin') && !hasAdminToken) return 'expected_fail';
  if (OPTIONAL_NAMES.has(name)) return 'expected_fail';
  return 'fail';
}

function flattenItems(items: PostmanItem[], folder = ''): Array<{ folder: string; item: PostmanItem }> {
  const out: Array<{ folder: string; item: PostmanItem }> = [];
  for (const entry of items) {
    if (entry.item) {
      out.push(...flattenItems(entry.item, entry.name));
    } else if (entry.request) {
      out.push({ folder, item: entry });
    }
  }
  return out;
}

async function checkServer(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function preLogin(vars: Record<string, string>): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/login/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  });
  const body = await res.json();
  extractVars('Login Email', body, vars);

  if (body?.data?.user?.id) {
    vars.userId = body.data.user.id;
    if (!vars.profileId) vars.profileId = body.data.user.id;
  }
  if (body?.data?.session?.refresh_token) {
    vars.refreshToken = body.data.session.refresh_token;
  }

  if (vars.token) {
    const profileRes = await fetch(`${BASE_URL}/profiles/me`, {
      headers: { Authorization: `Bearer ${vars.token}` },
    });
    const profileBody = await profileRes.json();
    extractVars('Get My Profile', profileBody, vars);
  }

  const catRes = await fetch(`${BASE_URL}/categories`);
  const catBody = await catRes.json();
  extractVars('Get Categories', catBody, vars);

  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const adminRes = await fetch(`${BASE_URL}/auth/login/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const adminBody = await adminRes.json();
    if (adminBody?.data?.session?.access_token) {
      vars.adminToken = adminBody.data.session.access_token;
    }
  }
}

function generateHtmlReport(results: ScanResult[], meta: Record<string, unknown>): string {
  const counts = {
    pass: results.filter((r) => r.status === 'pass').length,
    fail: results.filter((r) => r.status === 'fail').length,
    skip: results.filter((r) => r.status === 'skip').length,
    expected_fail: results.filter((r) => r.status === 'expected_fail').length,
  };

  const rows = results
    .map((r) => {
      const color =
        r.status === 'pass'
          ? '#22c55e'
          : r.status === 'expected_fail'
            ? '#f59e0b'
            : r.status === 'skip'
              ? '#94a3b8'
              : '#ef4444';
      const responseJson = JSON.stringify(r.responseBody, null, 2)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const requestJson = r.requestBody
        ? JSON.stringify(r.requestBody, null, 2)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
        : '';

      return `
      <tr>
        <td><span class="badge" style="background:${color}">${r.status.toUpperCase()}</span></td>
        <td>${r.httpStatus ?? '—'}</td>
        <td><code>${r.method}</code></td>
        <td>${r.folder}</td>
        <td><strong>${r.name}</strong>${r.note ? `<br><small>${r.note}</small>` : ''}</td>
        <td><code>${r.url}</code></td>
        <td>${r.durationMs}ms</td>
        <td>
          ${requestJson ? `<details><summary>Request</summary><pre>${requestJson}</pre></details>` : ''}
          <details open><summary>Response</summary><pre>${responseJson}</pre></details>
        </td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Promoo API Scan Report</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family:Segoe UI,system-ui,sans-serif; margin:0; background:#0f172a; color:#e2e8f0; }
    .header { padding:24px 32px; background:#1e293b; border-bottom:1px solid #334155; }
    h1 { margin:0 0 8px; font-size:1.5rem; }
    .meta { color:#94a3b8; font-size:0.9rem; }
    .stats { display:flex; gap:12px; margin-top:16px; flex-wrap:wrap; }
    .stat { padding:10px 16px; border-radius:8px; background:#334155; font-weight:600; }
    .content { padding:24px 32px; overflow-x:auto; }
    table { width:100%; border-collapse:collapse; font-size:0.85rem; }
    th, td { padding:10px 12px; border-bottom:1px solid #334155; vertical-align:top; text-align:left; }
    th { background:#1e293b; position:sticky; top:0; }
    code { font-size:0.8rem; word-break:break-all; }
    pre { background:#020617; padding:12px; border-radius:6px; overflow:auto; max-height:300px; font-size:0.75rem; }
    .badge { color:#fff; padding:2px 8px; border-radius:4px; font-size:0.7rem; font-weight:700; }
    details { margin-top:4px; }
    summary { cursor:pointer; color:#38bdf8; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Promoo API Scan Report</h1>
    <div class="meta">
      Base URL: <code>${meta.baseUrl}</code> ·
      Test user: <code>${meta.testEmail}</code> ·
      Generated: ${meta.generatedAt}
    </div>
    <div class="stats">
      <div class="stat" style="border-left:4px solid #22c55e">✅ Pass: ${counts.pass}</div>
      <div class="stat" style="border-left:4px solid #ef4444">❌ Fail: ${counts.fail}</div>
      <div class="stat" style="border-left:4px solid #f59e0b">⚠️ Expected: ${counts.expected_fail}</div>
      <div class="stat" style="border-left:4px solid #94a3b8">⏭ Skip: ${counts.skip}</div>
      <div class="stat">Total: ${results.length}</div>
    </div>
  </div>
  <div class="content">
    <table>
      <thead>
        <tr>
          <th>Status</th><th>HTTP</th><th>Method</th><th>Module</th>
          <th>Endpoint</th><th>URL</th><th>Time</th><th>Body</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🔍 Promoo API Scanner');
  console.log(`   Base URL: ${BASE_URL}`);
  console.log(`   Test user: ${TEST_EMAIL}\n`);

  const serverUp = await checkServer();
  if (!serverUp) {
    console.error('❌ Server is not running!');
    console.error('   Start it first:  npm run dev');
    process.exit(1);
  }
  console.log('✅ Server is up\n');

  const collectionPath = path.join(__dirname, '..', 'promoo_postman_collection.json');
  const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf-8'));
  const endpoints = flattenItems(collection.item as PostmanItem[]);

  const vars: Record<string, string> = {
    baseUrl: BASE_URL,
    token: '',
    adminToken: '',
    refreshToken: '',
    profileId: '',
    userId: '',
    offerId: '',
    adId: '',
    roomId: '',
    categoryId: '',
    planId: '',
    notificationId: '',
    reportId: '',
    paymentId: '',
    fileId: '',
  };

  console.log('🔐 Pre-login & loading reference data...');
  await preLogin(vars);
  console.log(`   Token: ${vars.token ? 'OK' : 'MISSING — many endpoints will fail'}`);
  console.log(`   Admin token: ${vars.adminToken ? 'OK' : 'not set (admin endpoints = expected fail)'}`);
  console.log(`   profileId: ${vars.profileId || '—'}`);
  console.log(`   categoryId: ${vars.categoryId || '—'}\n`);

  const results: ScanResult[] = [];

  for (const { folder, item } of endpoints) {
    const name = item.name;
    const method = item.request!.method;
    const url = buildUrl(item, vars);

    if (SKIP_NAMES.has(name)) {
      results.push({
        folder,
        name,
        method,
        url,
        status: 'skip',
        httpStatus: null,
        durationMs: 0,
        requestBody: null,
        responseBody: null,
        note: 'Skipped (destructive or session-ending)',
      });
      console.log(`⏭  SKIP  ${method} ${name}`);
      continue;
    }

    const missingVar = hasUnresolvedVars(url);
    if (missingVar && !vars[missingVar]) {
      results.push({
        folder,
        name,
        method,
        url,
        status: 'skip',
        httpStatus: null,
        durationMs: 0,
        requestBody: getRequestBody(item, vars),
        responseBody: null,
        note: `Missing variable: ${missingVar}`,
      });
      console.log(`⏭  SKIP  ${method} ${name} (missing {{${missingVar}}})`);
      continue;
    }

    let requestBody = getRequestBody(item, vars);
    requestBody = overrideBody(name, requestBody === 'formdata' ? 'formdata' : requestBody);

    try {
      const { httpStatus, body, durationMs } = await executeRequest(item, vars, folder);
      extractVars(name, body, vars);

      const status = classifyResult(name, httpStatus, folder, !!vars.adminToken);
      results.push({
        folder,
        name,
        method,
        url,
        status,
        httpStatus,
        durationMs,
        requestBody: requestBody === 'formdata' ? { _type: 'multipart/form-data', file: 'scan-test.png' } : requestBody,
        responseBody: body,
      });

      const icon = status === 'pass' ? '✅' : status === 'expected_fail' ? '⚠️' : '❌';
      console.log(`${icon} ${httpStatus} ${method} ${name} (${durationMs}ms)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({
        folder,
        name,
        method,
        url,
        status: 'fail',
        httpStatus: null,
        durationMs: 0,
        requestBody,
        responseBody: { error: message },
        note: 'Request threw an exception',
      });
      console.log(`❌ ERR  ${method} ${name} — ${message}`);
    }
  }

  ensureDir(REPORT_DIR);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const meta = {
    baseUrl: BASE_URL,
    testEmail: TEST_EMAIL,
    generatedAt: new Date().toISOString(),
    total: results.length,
    pass: results.filter((r) => r.status === 'pass').length,
    fail: results.filter((r) => r.status === 'fail').length,
    expected_fail: results.filter((r) => r.status === 'expected_fail').length,
    skip: results.filter((r) => r.status === 'skip').length,
  };

  const jsonReport = { meta, results };
  const jsonLatest = path.join(REPORT_DIR, 'api-scan-latest.json');
  const jsonArchive = path.join(REPORT_DIR, `api-scan-${timestamp}.json`);
  const htmlLatest = path.join(REPORT_DIR, 'api-scan-report.html');

  fs.writeFileSync(jsonLatest, JSON.stringify(jsonReport, null, 2), 'utf-8');
  fs.writeFileSync(jsonArchive, JSON.stringify(jsonReport, null, 2), 'utf-8');
  fs.writeFileSync(htmlLatest, generateHtmlReport(results, meta), 'utf-8');

  console.log('\n📁 Reports saved:');
  console.log(`   ${jsonLatest}`);
  console.log(`   ${htmlLatest}`);
  console.log(`   ${jsonArchive}`);
  console.log('\n📊 Summary:');
  console.log(`   ✅ Pass:          ${meta.pass}`);
  console.log(`   ❌ Fail:          ${meta.fail}`);
  console.log(`   ⚠️  Expected fail: ${meta.expected_fail}`);
  console.log(`   ⏭  Skipped:       ${meta.skip}`);

  if (meta.fail > 0) {
    console.log('\n❌ Some endpoints failed — open the HTML report for details.');
    process.exit(1);
  }

  console.log('\n✅ Scan complete — all critical endpoints passed!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
