# NuRoute JavaScript SDK

The official JavaScript / TypeScript SDK for [NuRoute](https://github.com/NuRoute-ai/sdk-js) — a provider-agnostic LLM gateway that lets you route, monitor, and control inference requests across OpenAI, Anthropic, Google, and more.

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

## License

MIT
