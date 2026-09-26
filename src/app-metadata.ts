import type { SignUpWithPasswordCredentials } from '@supabase/auth-js'

/**
 * Returns sign-up credentials with `options.data.app` set to `app`,
 * unless the caller already provided `options.data.app` (caller wins).
 *
 * The input object is never mutated. If `app` is empty, or the caller
 * already set `data.app`, the original credentials object is returned as is.
 */
export function withAppMetadata<T extends SignUpWithPasswordCredentials>(
  credentials: T,
  app: string | undefined
): T {
  if (!app || !credentials || typeof credentials !== 'object') return credentials

  const options = credentials.options ?? {}
  const data = (options.data ?? {}) as Record<string, unknown>
  if (data.app !== undefined) return credentials

  return {
    ...credentials,
    options: { ...options, data: { ...data, app } },
  }
}
