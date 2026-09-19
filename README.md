# NuRoute JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@aicp/sdk)](https://www.npmjs.com/package/@aicp/sdk)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The official JavaScript / TypeScript SDK for [NuRoute](https://nuroute.ai) — a provider-agnostic LLM gateway that lets you route, monitor, and control inference requests across OpenAI, Anthropic, Google, and more.

Point `model: 'auto'` at any request and NuRoute predicts the cheapest model that can still answer it well, so you stop paying frontier prices for prompts a cheaper model would handle just as well.

## Installation

```bash
npm install @aicp/sdk
# or
yarn add @aicp/sdk
# or
pnpm add @aicp/sdk
```

Requires **Node.js 18+** (uses native `fetch`). Works in modern browsers too.

## Quick start

```typescript
import { NuRouteClient } from '@aicp/sdk';

const client = new NuRouteClient({
  apiKey: 'aicp-...',
  baseUrl: 'https://your-nuroute-gateway',
});

const response = await client.chat.complete({
  model: 'auto', // classifies the request and routes it — see nuroute.ai/docs for strategies
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);
```

> Upgrading from an older version? `AICPClient` is still exported as a deprecated alias of
> `NuRouteClient` — existing code keeps working unchanged.

## Streaming

```typescript
for await (const chunk of client.chat.stream({
  model: 'auto',
  messages: [{ role: 'user', content: 'Tell me a story' }],
})) {
  process.stdout.write(chunk);
}
```

## Authentication

```typescript
const { token } = await client.auth.login({ email, password });
client.setApiKey(token);
```

## Documentation

Full SDK documentation: [nuroute.ai/docs](https://nuroute.ai/docs)

How routing decisions are made: [nuroute.ai/docs/concepts/routing-performance](https://nuroute.ai/docs/concepts/routing-performance)

## License

MIT
