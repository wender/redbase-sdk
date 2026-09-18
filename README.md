# @redbase/sdk

Official TypeScript SDK for [RedBase](https://redbase.dev) — a backend-as-a-service platform. If you're looking for an alternative to Supabase, this is it.

## Installation

```bash
npm install @redbase/sdk
# or
pnpm add @redbase/sdk
```

## Quick Start

```ts
import { createClient } from '@redbase/sdk'

const rb = createClient(
  'https://api.redbase.dev',
  'your-anon-key'
)
```

### Authentication

```ts
// Sign up a new user
const { data, error } = await rb.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
})

// Sign in
const { data, error } = await rb.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword',
})

// Get current session
const { data: { session } } = await rb.auth.getSession()

// Sign out
await rb.auth.signOut()
```

### Data Queries

Query your tables with the `from()` method:

```ts
// Select rows
const { data, error } = await rb.from('users').select('*')

// Select specific columns
const { data } = await rb.from('posts').select('id, title, created_at')

// Filter with conditions
const { data } = await rb.from('posts')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false })

// Insert
await rb.from('posts').insert({ title: 'Hello World', status: 'draft' })

// Update
await rb.from('posts').update({ status: 'published' }).eq('id', 1)

// Delete
await rb.from('posts').delete().eq('id', 1)
```

### Storage

Upload and manage files:

```ts
// List files in a bucket
const { data: files } = await rb.storage.from('photos').list()

// Upload a file
await rb.storage.from('photos').upload('avatar.png', file)

// Get a public URL
const { data } = rb.storage.from('photos').getPublicUrl('avatar.png')

// Download a file
const { data, error } = await rb.storage.from('photos').download('avatar.png')
```

### Email (Server-Side Only)

Send transactional emails with `email.send()`. This requires the **service role key** and should only be called from server-side code (API routes, edge functions, etc.).

```ts
import { createClient } from '@redbase/sdk'

const rb = createClient(
  process.env.REDBASE_URL!,
  process.env.REDBASE_SERVICE_ROLE_KEY!
)

const { success, messageId, error } = await rb.email.send({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to our app!</h1>',
  text: 'Welcome to our app!',    // optional plain text fallback
  replyTo: 'support@example.com', // optional
  cc: ['team@example.com'],       // optional
  bcc: ['logs@example.com'],      // optional
})

if (!success) {
  console.error('Email failed:', error)
}
```

## TypeScript Support

Use database types for full type safety:

```ts
import { createClient } from '@redbase/sdk'
import type { Database } from './database.types'

const rb = createClient<Database>(
  'https://api.redbase.dev',
  'your-anon-key'
)

// Queries are fully typed
const { data } = await rb.from('users').select('id, email, created_at')
// data is typed as { id: string; email: string; created_at: string }[] | null
```

## API Reference

### `createClient(url, key, options?)`

Creates a RedBase client instance.

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | RedBase API URL (e.g., `https://api.redbase.dev`) |
| `key` | `string` | API key — anon key for client-side, service role key for server-side |
| `options` | `RedbaseClientOptions` | Optional client configuration |

Returns a `RedbaseClient` with:
- `auth` — Authentication methods (signUp, signIn, signOut, getSession, etc.)
- `from(table)` — Query builder for database tables
- `storage` — File storage operations
- `email` — Transactional email (server-side only)

### `email.send(options)`

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `to` | `string \| string[]` | Yes | Recipient email address(es) |
| `subject` | `string` | Yes | Email subject line |
| `html` | `string` | Yes | HTML body content |
| `text` | `string` | No | Plain text fallback |
| `replyTo` | `string` | No | Reply-to address |
| `cc` | `string \| string[]` | No | CC recipients |
| `bcc` | `string \| string[]` | No | BCC recipients |

Returns: `Promise<{ success: boolean; messageId?: string; error?: string }>`

## Exported Types

```ts
import {
  createClient,
  RedbaseClient,
  RedbaseClientOptions,
  
  // Auth types
  Session,
  User,
  AuthError,
  AuthResponse,
  
  // Database types
  PostgrestError,
  PostgrestResponse,
  
  // Email types
  EmailClient,
  EmailSendOptions,
  EmailSendResponse,
  
  // Realtime types
  RealtimeChannel,
} from '@redbase/sdk'
```

## Links

- [RedBase](https://redbase.dev)
- [API](https://api.redbase.dev)
- [GitHub](https://github.com/wender/redbase-sdk)

## License

MIT
