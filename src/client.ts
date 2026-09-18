import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from '@supabase/supabase-js'
import { createEmailClient } from './email'
import type { EmailClient } from './types'

/**
 * RedBase client options.
 * See @supabase/supabase-js SupabaseClientOptions for full documentation.
 */
export interface RedbaseClientOptions {
  auth?: {
    autoRefreshToken?: boolean
    persistSession?: boolean
    detectSessionInUrl?: boolean
    storage?: unknown
    storageKey?: string
    flowType?: 'implicit' | 'pkce'
  }
  global?: {
    headers?: Record<string, string>
    fetch?: typeof fetch
  }
  db?: {
    schema?: string
  }
  realtime?: {
    params?: Record<string, unknown>
  }
}

/**
 * RedBase client type - a Supabase client with email capabilities.
 * 
 * Use with your Database types for full type safety:
 * ```ts
 * import type { Database } from './database.types'
 * const rb = createClient<Database>(url, key)
 * ```
 */
export type RedbaseClient<Database = unknown> = SupabaseClient<Database> & {
  /**
   * Email client for sending transactional emails.
   * **Server-side only.** Requires `SERVICE_ROLE_KEY`.
   */
  email: EmailClient
}

/**
 * Creates a RedBase client instance.
 *
 * The client is a thin wrapper around `@supabase/supabase-js` that provides:
 * - Full Supabase client compatibility (`auth`, `from`, `storage`, etc.)
 * - Additional `email` helper for sending transactional emails
 *
 * @param redbaseUrl - The RedBase API URL (e.g., `https://api.payagenda.com` or `http://localhost:8000`)
 * @param redbaseKey - The API key (anon key for client, service role key for server)
 * @param options - Optional client configuration
 * @returns A RedBase client instance
 *
 * @example
 * ```ts
 * // Client-side usage (anon key)
 * import { createClient } from '@redbase/sdk'
 *
 * const rb = createClient(
 *   import.meta.env.VITE_REDBASE_URL,
 *   import.meta.env.VITE_REDBASE_ANON_KEY
 * )
 *
 * // Use like Supabase client
 * const { data } = await rb.from('users').select('*')
 * const { data: session } = await rb.auth.getSession()
 * ```
 *
 * @example
 * ```ts
 * // With Database types
 * import { createClient } from '@redbase/sdk'
 * import type { Database } from './database.types'
 *
 * const rb = createClient<Database>(
 *   import.meta.env.VITE_REDBASE_URL,
 *   import.meta.env.VITE_REDBASE_ANON_KEY
 * )
 *
 * // Fully typed queries
 * const { data } = await rb.from('users').select('id, email')
 * ```
 *
 * @example
 * ```ts
 * // Server-side usage (service role key for email)
 * import { createClient } from '@redbase/sdk'
 *
 * const rb = createClient(
 *   process.env.REDBASE_URL!,
 *   process.env.REDBASE_SERVICE_ROLE_KEY!
 * )
 *
 * // Send transactional email
 * const { success, error } = await rb.email.send({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Welcome to our app!</h1>',
 * })
 * ```
 */
export function createClient<Database = unknown>(
  redbaseUrl: string,
  redbaseKey: string,
  options?: RedbaseClientOptions
): RedbaseClient<Database> {
  // Create the underlying Supabase client
  // Using any internally to avoid complex generic constraints in supabase-js
  const supabase = createSupabaseClient<Database>(
    redbaseUrl,
    redbaseKey,
    options as Parameters<typeof createSupabaseClient>[2]
  )

  // Create the email client
  const email = createEmailClient(redbaseUrl, redbaseKey)

  // Augment the client with email functionality
  return Object.assign(supabase as SupabaseClient<Database>, { email }) as RedbaseClient<Database>
}
