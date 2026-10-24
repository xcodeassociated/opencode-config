import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

// Isolated logic test; stubs @opencode/plugin so no running V2 server needed.
// This does not verify that a real OpenCode installation loads the plugin.
const load = async (file) => {
  const source = await readFile(new URL(file, import.meta.url), 'utf8');
  const isolated = source.replace(
    /import \{ Plugin \} from ["']@opencode\/plugin["'];?/,
    'const Plugin = { define: (definition) => definition };',
  );
  return (await import('data:text/javascript;charset=utf-8,' + encodeURIComponent(isolated))).default;
};

const guard = await load('../plugins/firecrawl-first-guard.js');
const researcher = await load('../plugins/researcher-temperature.js');

const hooks = {};
await guard.setup({ tool: { hook: async (name, cb) => { hooks[name] = cb; } } });
const before = (sessionID, tool) => hooks['execute.before']({ sessionID, tool, input: {} });

test('fallback denied until Firecrawl has been attempted in the same session', () => {
  assert.throws(() => before('s1', 'searxng_search'), /Firecrawl-first policy/);
  assert.throws(() => before('s1', 'websearch'), /Firecrawl-first policy/);
  assert.throws(() => before('s1', 'webfetch'), /Firecrawl-first policy/);
  assert.throws(() => before('s1', 'duckduckgo_search'), /Firecrawl-first policy/);
  before('s1', 'firecrawl_firecrawl_search');
  assert.doesNotThrow(() => before('s1', 'searxng_search'));
  assert.doesNotThrow(() => before('s1', 'websearch'));
  assert.doesNotThrow(() => before('s1', 'duckduckgo_search'));
  assert.throws(() => before('s2', 'searxng_search'), /Firecrawl-first policy/);
});

test('direct Firecrawl retrieval variants count as attempts', () => {
  before('s3', 'firecrawl_search');
  assert.doesNotThrow(() => before('s3', 'webfetch'));
  before('s4', 'firecrawl_scrape');
  assert.doesNotThrow(() => before('s4', 'searxng_search'));
  before('s5', 'firecrawl_developer_search');
  assert.doesNotThrow(() => before('s5', 'websearch'));
});

test('ordinary tools are unaffected', () => {
  assert.doesNotThrow(() => before('s6', 'read'));
  assert.doesNotThrow(() => before('s6', 'playwright_browser_navigate'));
});

test('researcher temperature applies only to researcher requests', async () => {
  const handlers = {};
  await researcher.setup({ session: { hook: async (name, cb) => { handlers[name] = cb; } } });
  const r = { agent: 'researcher', options: { temperature: 0.8 } };
  const b = { agent: 'build', options: { temperature: 0.8 } };
  handlers.context(r); handlers.context(b);
  assert.equal(r.options.temperature, 0.1);
  assert.equal(b.options.temperature, 0.8);
});
