import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { setImmediate } from 'node:timers/promises';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function loader(mocks = {}) {
  const cache = new Map();
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = { exports: {} };
    cache.set(filename, loaded);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    const customRequire = (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (id.startsWith('@/')) return load(path.resolve('src', id.slice(2)) + '.ts');
      return require(id);
    };
    new Function('require', 'module', 'exports', code)(customRequire, loaded, loaded.exports);
    return loaded.exports;
  }
  return load;
}

const { bookingDateInput, formatBookingDate, formatEmailDate } = loader()('src/lib/adminBookingDates.ts');

test('missing and malformed booking dates never crash formatting or become another day', () => {
  for (const value of [null, undefined, '', 'invalid', '23/10/2026', '2026-02-30', '2026-13-01', '2026-10-23Tinvalid']) {
    assert.equal(bookingDateInput(value), '');
    assert.equal(formatBookingDate(value), value ? 'Date invalide' : 'Date non renseignée');
  }
  assert.equal(bookingDateInput('2026-10-23'), '2026-10-23');
  assert.equal(bookingDateInput('2026-10-23T23:30:00-07:00'), '2026-10-23');
  assert.equal(formatBookingDate('2026-10-23'), '23 oct. 2026');
  assert.equal(formatBookingDate('2026-10-23T23:30:00-07:00'), '23 oct. 2026');
  assert.equal(bookingDateInput('2024-02-29'), '2024-02-29');
  assert.equal(bookingDateInput('2025-02-29'), '');
});

test('missing or invalid email timestamps do not crash the table', () => {
  assert.equal(formatEmailDate(null), '—');
  assert.equal(formatEmailDate(undefined), '—');
  assert.equal(formatEmailDate('not-a-date'), 'Date invalide');
  assert.match(formatEmailDate('2026-10-23T10:00:00Z'), /23 oct\. 2026/);
});

const studio = { id: 'cs_fixture', first_name: 'Client', last_name: 'Test', email: 'test@example.com', phone: null, booking_date: '', slot: '10:00', service: 'Studio', duration: 1, amount_paid_cents: 5000, payment_mode: 'full', status: 'confirmed', client_email_sent_at: 'invalid', admin_email_sent_at: null, review_email_sent_at: null };

function pageHarness(initial = {}) {
  const React = require('react');
  const effects = [];
  const states = [];
  const redirects = [];
  let cursor = 0;
  const mockReact = {
    ...React,
    useState(value) {
      const index = cursor++;
      states[index] = Object.hasOwn(initial, index) ? initial[index] : value;
      return [states[index], (next) => { states[index] = typeof next === 'function' ? next(states[index]) : next; }];
    },
    useMemo: (fn) => fn(),
    useEffect: (fn) => effects.push(fn),
  };
  const Page = loader({ react: mockReact, 'next/navigation': { useRouter: () => ({ push: (url) => redirects.push(url) }) } })('src/app/admin/bookings/page.tsx').default;
  const html = require('react-dom/server').renderToStaticMarkup(React.createElement(Page));
  return { html, effects, states, redirects };
}

test('the actual bookings page renders Stripe records with missing dates alongside valid reservations', () => {
  const { html } = pageHarness({ 0: [studio, { ...studio, id: 'second', booking_date: '2026-10-23' }], 2: false });
  assert.match(html, /Date non renseignée/);
  assert.match(html, /Date invalide/);
  assert.match(html, /23 oct\. 2026/);
  assert.match(html, /Client Test/);
});

test('studio results remain available when the Congo request fails over the network', async (t) => {
  t.mock.method(global, 'fetch', async (url) => {
    if (url.endsWith('event-bookings')) throw new Error('network');
    return Response.json({ bookings: [studio], source: 'stripe', warning: 'Affichage de secours depuis Stripe.' });
  });
  const page = pageHarness();
  page.effects.forEach((effect) => effect());
  await setImmediate();
  assert.deepEqual(page.states[0], [studio]);
  assert.equal(page.states[2], false);
  assert.match(page.states[3], /Stripe/);
  assert.match(page.states[3], /Congo : erreur de connexion/);
});

test('both API errors are shown and unauthorized responses still redirect to login', async (t) => {
  t.mock.method(global, 'fetch', async (url) => Response.json({ error: url.endsWith('event-bookings') ? 'Accès Supabase refusé.' : 'Studio indisponible.' }, { status: 500 }));
  const page = pageHarness();
  page.effects.forEach((effect) => effect());
  await setImmediate();
  assert.match(page.states[3], /Studio : Studio indisponible/);
  assert.match(page.states[3], /Congo : Accès Supabase refusé/);
  global.fetch = async () => Response.json({ error: 'Non autorisé.' }, { status: 401 });
  const unauthorized = pageHarness();
  unauthorized.effects.forEach((effect) => effect());
  await setImmediate();
  assert.deepEqual(unauthorized.redirects, ['/admin/login']);
});
