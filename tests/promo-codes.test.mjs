import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);

// Load the actual TypeScript modules without adding a test-runner dependency.
function loader(mocks = {}) {
  const cache = new Map();
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loadedModule = { exports: {} };
    cache.set(filename, loadedModule);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
    const customRequire = (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id.startsWith('.') || id.startsWith('@/')) {
        let target = id.startsWith('@/') ? path.resolve('src', id.slice(2)) : path.resolve(path.dirname(filename), id);
        if (!target.endsWith('.ts')) target += '.ts';
        const alias = '@/' + path.relative(path.resolve('src'), target).replace(/\.ts$/, '');
        if (Object.hasOwn(mocks, alias)) return mocks[alias];
        return load(target);
      }
      return require(id);
    };
    new Function('require', 'module', 'exports', code)(customRequire, loadedModule, loadedModule.exports);
    return loadedModule.exports;
  }
  return load;
}

const load = loader();
const { normalizePromoCode, parsePromoCodeInput, assertPromoEligible, calculatePromoAmounts, readPromoSnapshot } = load('src/lib/promoCodes.ts');
const sample = { id: 'b1098fbf-171f-4444-8888-000000000001', code: 'CREATEUR10', creator_name: 'Créateur test', discount_type: 'percentage', discount_value: 10, service_ids: ['location-studio'], expires_at: null, active: true };
const booking = { firstName: 'Test', lastName: 'Local', email: 'test@example.com', phone: '0600000000', service: 'Location Du Studio', date: '2099-10-21', formattedDate: '21 octobre 2099', slot: '10:00', duration: 3, paymentMode: 'deposit', captchaToken: 'mock-token' };
const nextMock = { NextResponse: { json: (data, init) => Response.json(data, init) } };
const request = (body) => new Request('http://localhost/api/test', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

test('admin validates codes, precision, scope and dates', () => {
  assert.equal(normalizePromoCode('  createur10 '), 'CREATEUR10');
  assert.equal(parsePromoCodeInput({ ...sample, discount_value: '12.50' }).discount_value, 12.5);
  for (const update of [{ code: 'a!' }, { discount_value: -1 }, { discount_value: 100 }, { discount_value: 1.234 }, { service_ids: [] }, { service_ids: ['unknown'] }, { expires_at: 'no date' }, { creator_name: '' }, { active: 'true' }]) {
    assert.throws(() => parsePromoCodeInput({ ...sample, ...update }));
  }
});

test('discount applies to total before deposit; balance reconciles to the cent', () => {
  assert.deepEqual(calculatePromoAmounts(100, sample, 'deposit'), { originalCents: 10000, discountCents: 1000, totalCents: 9000, paidCents: 2700, remainingCents: 6300 });
  const fixed = calculatePromoAmounts(100.01, { discount_type: 'fixed', discount_value: 12.34 }, 'deposit');
  assert.equal(fixed.totalCents, 8767);
  assert.equal(fixed.paidCents, 2630);
  assert.equal(fixed.remainingCents, 6137);
  assert.equal(fixed.paidCents + fixed.remainingCents, fixed.totalCents);
  assert.equal(calculatePromoAmounts(100, sample, 'full').paidCents, 9000);
});

test('inactive, expired, wrong-service, quote and internal-test codes are rejected', () => {
  assertPromoEligible(sample, 'Location Du Studio');
  assert.throws(() => assertPromoEligible({ ...sample, active: false }, 'Location Du Studio'));
  assert.throws(() => assertPromoEligible({ ...sample, expires_at: '2020-01-01T00:00:00Z' }, 'Location Du Studio'));
  assert.throws(() => assertPromoEligible(sample, 'Podcasts'));
  assert.throws(() => assertPromoEligible(sample, 'Test Paiement Talaref'));
  assert.throws(() => assertPromoEligible(sample, 'Unknown'));
  assertPromoEligible({ ...sample, service_ids: ['prestation-photographe'] }, 'Polas');
});

test('discounts cannot create zero/negative or below-minimum payments', () => {
  for (const [base, promo, mode] of [[40, { discount_type: 'fixed', discount_value: 50 }, 'full'], [40, { discount_type: 'fixed', discount_value: 40 }, 'full'], [40, { discount_type: 'percentage', discount_value: 99 }, 'deposit'], [40, { discount_type: 'fixed', discount_value: NaN }, 'full']]) {
    assert.throws(() => calculatePromoAmounts(base, promo, mode));
  }
});

function metadata() {
  return { ...Object.fromEntries(Object.entries(booking).map(([key, value]) => [key, String(value)])), promoCodeId: sample.id, promoCode: sample.code, promoCreator: sample.creator_name, promoDiscountType: 'percentage', promoDiscountValue: '10', originalAmountCents: '10000', discountAmountCents: '1000', baseAmount: '90.00', paidAmount: '27.00' };
}

test('immutable checkout snapshot validates without looking up the current code', () => {
  assert.equal(readPromoSnapshot(metadata(), 'deposit').remainingCents, 6300);
  assert.equal(readPromoSnapshot({}, 'full'), null);
  for (const update of [{ discountAmountCents: '9999' }, { baseAmount: '100' }, { baseAmount: 'NaN' }, { paidAmount: '1' }, { promoDiscountType: 'invalid' }, { promoCodeId: '' }, { originalAmountCents: '-100' }]) {
    assert.throws(() => readPromoSnapshot({ ...metadata(), ...update }, 'deposit'));
  }
});

test('public preview recalculates the price and does not expose creator information', async () => {
  const previewLoad = loader({ 'next/server': nextMock, '@/lib/supabaseAdmin': { supabaseAdmin: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: sample, error: null }) }) }) }) } } });
  const { POST } = previewLoad('src/app/api/promo-codes/validate/route.ts');
  const response = await POST(request({ ...booking, code: 'createur10', baseAmount: 1, discountAmount: 99 }));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.originalCents, 10000);
  assert.equal(data.paidCents, 2700);
  assert.equal(data.creator_name, undefined);
  assert.equal(data.id, undefined);
  assert.equal(data.service_ids, undefined);
  assert.equal((await POST(request({ ...booking, code: 'createur10', service: 'invalid' }))).status, 400);
});

test('checkout charges the server-calculated discount and snapshots creator attribution', async (t) => {
  let created;
  t.mock.method(global, 'fetch', async () => Response.json({ success: true }));
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
  process.env.SITE_URL = 'https://example.com';
  const checkoutLoad = loader({
    'next/server': nextMock,
    stripe: class { checkout = { sessions: { create: async (input) => { created = input; return { url: 'https://checkout.stripe.com/mock' }; } } }; },
    '@/lib/supabaseAdmin': { supabaseAdmin: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: sample, error: null }) }) }) }) } },
  });
  const { POST } = checkoutLoad('src/app/api/send/route.ts');
  const response = await POST(request({ ...booking, promoCode: 'createur10', amountInCents: 1, paidAmount: 1, discountAmountCents: 9999 }));
  assert.equal(response.status, 200);
  assert.equal(created.line_items[0].price_data.unit_amount, 2700);
  assert.equal(created.metadata.promoCode, 'CREATEUR10');
  assert.equal(created.metadata.promoCodeId, sample.id);
  assert.equal(created.metadata.promoCreator, sample.creator_name);
  assert.equal(created.metadata.baseAmount, '90.00');
  assert.equal(created.metadata.originalAmountCents, '10000');
  assert.equal(created.metadata.discountAmountCents, '1000');
  await POST(request(booking));
  assert.equal(created.line_items[0].price_data.unit_amount, 3000);
  assert.equal(created.metadata.promoCode, undefined);
});

test('checkout revalidates deactivated codes instead of trusting the preview', async (t) => {
  t.mock.method(global, 'fetch', async () => Response.json({ success: true }));
  let creations = 0;
  const checkoutLoad = loader({
    'next/server': nextMock,
    stripe: class { checkout = { sessions: { create: async () => { creations++; } } }; },
    '@/lib/supabaseAdmin': { supabaseAdmin: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { ...sample, active: false }, error: null }) }) }) }) } },
  });
  const { POST } = checkoutLoad('src/app/api/send/route.ts');
  assert.equal((await POST(request({ ...booking, promoCode: sample.code }))).status, 400);
  assert.equal(creations, 0);
});

test('admin routes reject unauthorized requests before any database access', async () => {
  const adminLoad = loader({ 'next/server': nextMock, 'next/headers': { cookies: async () => ({ get: () => undefined }) }, '@/lib/supabaseAdmin': { supabaseAdmin: { from: () => { throw new Error('Must not access the database'); } } } });
  const { GET, POST, PATCH } = adminLoad('src/app/api/admin/promo-codes/route.ts');
  assert.equal((await GET()).status, 401);
  assert.equal((await POST(request(sample))).status, 401);
  assert.equal((await PATCH(request(sample))).status, 401);
});

test('webhook records the paid promo snapshot once per Stripe session, rejects mismatches and retries database failures', async (t) => {
  t.mock.method(console, 'error', () => {});
  const rows = new Map();
  let failDatabase = true;
  let session = { id: 'cs_mock', payment_status: 'paid', amount_total: 2700, metadata: metadata() };
  const webhookLoad = loader({
    'next/server': nextMock,
    googleapis: { google: {} },
    stripe: class { webhooks = { constructEvent: () => ({ type: 'checkout.session.completed', data: { object: session } }) }; },
    '@/lib/mailjet': { getAdminEmail: () => 'test@example.com', getMailjetSender: () => ({ email: 'test@example.com' }), sendMailjetEmail: async () => {} },
    '@/lib/supabaseAdmin': { supabaseAdmin: { from: () => ({ upsert: async (row, options) => { assert.equal(options.onConflict, 'stripe_session_id'); rows.set(row.stripe_session_id, row); return { error: failDatabase ? { code: 'mock-error' } : null }; }, update: () => ({ eq: async () => ({ error: null }) }) }) } },
  });
  const { POST } = webhookLoad('src/app/api/webhooks/stripe/route.ts');
  const webhookRequest = () => new Request('http://localhost/api/webhooks/stripe', { method: 'POST', headers: { 'stripe-signature': 'mock-signature' }, body: '{}' });
  assert.equal((await POST(webhookRequest())).status, 500);
  assert.equal(rows.get('cs_mock').promo_code_id, sample.id);
  assert.equal(rows.get('cs_mock').total_amount_cents, 9000);
  assert.equal(rows.get('cs_mock').amount_paid_cents, 2700);
  failDatabase = false;
  assert.equal((await POST(webhookRequest())).status, 200);
  assert.equal((await POST(webhookRequest())).status, 200);
  assert.equal(rows.size, 1);
  session = { ...session, amount_total: 2000 };
  assert.equal((await POST(webhookRequest())).status, 400);
  session = { ...session, payment_status: 'unpaid' };
  assert.equal((await POST(webhookRequest())).status, 200);
});
