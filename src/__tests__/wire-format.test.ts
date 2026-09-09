import { afterEach, describe, expect, it, vi } from 'vitest';
import { NuRouteClient } from '../index';

// Regression tests for a class of bug found auditing the SDK docs against actual behavior:
// the gateway returns snake_case for some endpoints (project policy/budget, invite info) and
// camelCase for others (routing config), and this client silently returned whatever the wire
// sent with no translation — so `budget.currentSpend`, `policy.maxTokens`, and
// `inviteInfo.orgName` were all `undefined` even though the declared types promised them.

function mockJson(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }),
  );
}

describe('project budget/policy wire-format translation', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('budget.get() translates the snake_case response into the declared camelCase shape', async () => {
    vi.stubGlobal('fetch', mockJson({
      project_id: 'proj_1', org_id: 'org_1',
      monthly_usd: 100, alert_pct: 80, hard_limit: true, current_spend: 42.5,
    }));

    const client = new NuRouteClient({ apiKey: 'x', baseUrl: 'http://example.test' });
    const budget = await client.project('proj_1').budget.get();

    expect(budget).toEqual({
      projectId: 'proj_1', orgId: 'org_1',
      monthlyUsd: 100, alertPct: 80, hardLimit: true, currentSpend: 42.5,
    });
  });

  it('policy.get() translates the snake_case response into the declared camelCase shape', async () => {
    vi.stubGlobal('fetch', mockJson({
      project_id: 'proj_1', org_id: 'org_1',
      allowed_models: ['gpt-4o'], blocked_models: [], allowed_providers: ['openai'],
      blocked_providers: [], allowed_regions: ['eu'], max_tokens: 4096,
    }));

    const client = new NuRouteClient({ apiKey: 'x', baseUrl: 'http://example.test' });
    const policy = await client.project('proj_1').policy.get();

    expect(policy).toEqual({
      projectId: 'proj_1', orgId: 'org_1',
      allowedModels: ['gpt-4o'], blockedModels: [], allowedProviders: ['openai'],
      blockedProviders: [], allowedRegions: ['eu'], maxTokens: 4096,
    });
  });

  it('policy.set() sends snake_case on the wire — previously sent camelCase, which the backend silently ignored', async () => {
    const fetchMock = mockJson({ success: true });
    vi.stubGlobal('fetch', fetchMock);

    const client = new NuRouteClient({ apiKey: 'x', baseUrl: 'http://example.test' });
    await client.project('proj_1').policy.set({ maxTokens: 4096, allowedModels: ['gpt-4o'] });

    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body)).toEqual({ max_tokens: 4096, allowed_models: ['gpt-4o'] });
  });
});

describe('auth.getInviteInfo() wire-format translation', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('translates the snake_case response and omits orgId, which the backend never returns', async () => {
    vi.stubGlobal('fetch', mockJson({
      org_name: 'Acme', email: 'a@acme.test', role: 'developer', expires_at: 1234567890,
    }));

    const client = new NuRouteClient({ apiKey: 'x', baseUrl: 'http://example.test' });
    const info = await client.auth.getInviteInfo('tok');

    expect(info).toEqual({
      orgName: 'Acme', email: 'a@acme.test', role: 'developer', expiresAt: 1234567890,
    });
  });
});
