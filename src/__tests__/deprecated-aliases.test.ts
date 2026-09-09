import { afterEach, describe, expect, it, vi } from 'vitest';
import { AICPClient, AICPError, NuRouteClient, NuRouteError } from '../index';

// These tests exist because AICPClient/AICPError are deprecated aliases kept for backward
// compatibility during the AICP -> NuRoute rebrand. They must keep behaving exactly like
// their NuRoute-named counterparts — a silent break here would land in every customer
// integration still using the old names.

describe('deprecated AICPClient alias', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is a subclass of NuRouteClient', () => {
    const client = new AICPClient({ apiKey: 'aicp-test' });
    expect(client).toBeInstanceOf(NuRouteClient);
    expect(client).toBeInstanceOf(AICPClient);
  });

  it('behaves identically to NuRouteClient for a successful request', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ status: 'ok', version: '1.2.3' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const oldClient = new AICPClient({ apiKey: 'aicp-test', baseUrl: 'http://example.test' });
    const newClient = new NuRouteClient({ apiKey: 'aicp-test', baseUrl: 'http://example.test' });

    const oldResult = await oldClient.health();
    const newResult = await newClient.health();

    expect(oldResult).toEqual(newResult);
    expect(oldResult).toEqual({ status: 'ok', version: '1.2.3' });
  });

  it('throws the same error shape as NuRouteClient on a failed request', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: 'nope', type: 'bad_request', code: 'X' } }), {
        status: 400,
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const client = new AICPClient({ apiKey: 'aicp-test', baseUrl: 'http://example.test' });

    await expect(client.health()).rejects.toMatchObject({
      status: 400,
      errorType: 'bad_request',
      code: 'X',
      message: 'nope',
    });
  });
});

describe('deprecated AICPError alias', () => {
  it('is the exact same class as NuRouteError, not a separate subclass', () => {
    // A plain re-export (not `class AICPError extends NuRouteError {}`) so that errors thrown
    // internally as NuRouteError still satisfy `err instanceof AICPError` for existing catch
    // blocks written against the old name.
    expect(AICPError).toBe(NuRouteError);
  });

  it('errors thrown by the client satisfy `instanceof AICPError`', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    const client = new NuRouteClient({ apiKey: 'aicp-test', baseUrl: 'http://example.test' });

    await expect(client.health()).rejects.toBeInstanceOf(AICPError);

    vi.unstubAllGlobals();
  });
});
