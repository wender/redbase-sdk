# @wender/redbase-sdk

RedBase client SDK — Supabase-compatible BaaS for Rednew apps.

A thin wrapper around `@supabase/supabase-js` that provides full Supabase client compatibility with additional RedBase features like transactional email.

## Installation

```bash
npm install @wender/redbase-sdk
# or
pnpm add @wender/redbase-sdk
```

## Quick Start

### Environment Variables

Configure your app with RedBase credentials:

```env
# Vite / React / Next.js
VITE_REDBASE_URL=https://api.payagenda.com
VITE_REDBASE_ANON_KEY=eyJ...

# Note: PUBLISHABLE_KEY = ANON_KEY for existing Rednew apps
# If migrating from Supabase env vars, you can keep using VITE_SUPABASE_* names
```

### Basic Usage

```ts
import { createClient } from '@wender/redbase-sdk'

const rb = createClient(
  import.meta.env.VITE_REDBASE_URL,
  import.meta.env.VITE_REDBASE_ANON_KEY
)

// Auth — works exactly like Supabase
const { data: session } = await rb.auth.getSession()
await rb.auth.signInWithPassword({ email, password })
await rb.auth.signUp({ email, password })

// Database — full PostgREST compatibility
const { data, error } = await rb.from('users').select('*')
await rb.from('posts').insert({ title: 'Hello' })
await rb.from('posts').update({ title: 'Updated' }).eq('id', 1)

// Storage — S3-compatible via MinIO
const { data: files } = await rb.storage.from('photos').list()
await rb.storage.from('photos').upload('avatar.png', file)
```

### With TypeScript Database Types

Generate types from your database schema (same as Supabase):

```ts
import { createClient } from '@wender/redbase-sdk'
import type { Database } from './database.types'

const rb = createClient<Database>(
  import.meta.env.VITE_REDBASE_URL,
  import.meta.env.VITE_REDBASE_ANON_KEY
)

// Fully typed!
const { data } = await rb.from('users').select('id, email, created_at')
// data is typed as { id: string; email: string; created_at: string }[] | null
```

## Email (Server-Side Only)

Send transactional emails via the RedBase email worker.

> **Important:** The email endpoint requires `SERVICE_ROLE_KEY` and should only be called from server-side code (API routes, edge functions, etc.). Never expose your service role key to the client.

> **Note:** The `/email/v1/send` endpoint may return 404 until the email worker PR lands. The client is typed and ready.

```ts
// Server-side (Node.js, Edge, API route)
import { createClient } from '@wender/redbase-sdk'

const rb = createClient(
  process.env.REDBASE_URL!,
  process.env.REDBASE_SERVICE_ROLE_KEY!  // Must be service role key!
)

const { success, messageId, error } = await rb.email.send({
  to: 'user@example.com',
  subject: 'Welcome to our app!',
  html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
  text: 'Welcome! Thanks for signing up.',  // optional fallback
  replyTo: 'support@example.com',           // optional
  cc: ['team@example.com'],                 // optional
  bcc: ['logs@example.com'],                // optional
})

if (!success) {
  console.error('Email failed:', error)
}
```

## Whitelabel Setup

For whitelabel deployments, point the URL to your app's API domain:

```ts
// Each app gets its own subdomain
const rb = createClient(
  'https://api.payagenda.com',  // or 'https://api.nivelcerto.com'
  import.meta.env.VITE_REDBASE_ANON_KEY
)
```

The RedBase gateway routes `/auth/v1`, `/rest/v1`, and `/storage/v1` to the correct services.

## Migration from Supabase

If your app already uses `@supabase/supabase-js`, you have two options:

### Option 1: Keep using @supabase/supabase-js (recommended for existing apps)

Just update your environment variables:

```env
# Before
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# After
VITE_SUPABASE_URL=https://api.payagenda.com  # RedBase URL
VITE_SUPABASE_ANON_KEY=<your RedBase anon key>
```

Your existing code works unchanged — RedBase is fully compatible with the Supabase client.

### Option 2: Switch to @wender/redbase-sdk

For access to RedBase-specific features like `email.send()`:

```bash
npm install @wender/redbase-sdk
```

```ts
// Before
import { createClient } from '@supabase/supabase-js'

// After
import { createClient } from '@wender/redbase-sdk'
```

The API is identical; `rb.auth`, `rb.from()`, and `rb.storage` work exactly the same.

## API Reference

### `createClient(url, key, options?)`

Creates a RedBase client instance.

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | RedBase API URL |
| `key` | `string` | API key (anon for client, service role for server) |
| `options` | `SupabaseClientOptions` | Optional Supabase client config |

Returns a `RedbaseClient` with all Supabase methods plus:

- `email.send(options)` — Send transactional email (server-side only)

### `email.send(options)`

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `to` | `string \| string[]` | Yes | Recipient(s) |
| `subject` | `string` | Yes | Email subject |
| `html` | `string` | Yes | HTML body |
| `text` | `string` | No | Plain text fallback |
| `replyTo` | `string` | No | Reply-to address |
| `cc` | `string \| string[]` | No | CC recipients |
| `bcc` | `string \| string[]` | No | BCC recipients |

Returns: `Promise<{ success: boolean; messageId?: string; error?: string }>`

## Re-exported Types

For convenience, commonly used Supabase types are re-exported:

```ts
import {
  // Client
  createClient,
  SupabaseClient,
  
  // Auth
  Session,
  User,
  AuthError,
  
  // Database
  PostgrestError,
  PostgrestResponse,
  
  // Realtime
  RealtimeChannel,
  
  // RedBase-specific
  RedbaseClient,
  EmailClient,
  EmailSendOptions,
  EmailSendResponse,
} from '@wender/redbase-sdk'
```

## Local Development

### Link the package locally

```bash
cd packages/sdk
npm install
npm run build
npm pack
# Creates @rednew-redbase-0.1.0.tgz

# In your app:
npm install ../redbase/packages/sdk/rednew-redbase-0.1.0.tgz
```

Or use npm link:

```bash
cd packages/sdk
npm link

# In your app:
npm link @wender/redbase-sdk
```

### Build

```bash
npm run build      # Build ESM + CJS + types
npm run typecheck  # Type check only
npm run dev        # Watch mode
```

## License

MIT
