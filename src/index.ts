/**
 * @redbase/sdk - RedBase client SDK
 *
 * Supabase-compatible BaaS client for Rednew apps with additional
 * email functionality.
 *
 * @packageDocumentation
 */

export { createClient, type RedbaseClient, type RedbaseClientOptions } from './client'

export { withAppMetadata } from './app-metadata'

export type {
  EmailClient,
  EmailSendOptions,
  EmailSendResponse,
} from './types'

export {
  createClient as createSupabaseClient,
  SupabaseClient,
  PostgrestError,
  FunctionsError,
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
  FunctionRegion,
} from '@supabase/supabase-js'

// Re-export from storage-js: supabase-js 2.97 (in the ^2.45 range) does not
// export StorageApiError. Node ESM then fails at import time; browser
// bundles tree-shake the unused binding and are unaffected.
export { StorageApiError } from '@supabase/storage-js'

export type {
  SupabaseClientOptions,
  PostgrestResponse,
  PostgrestSingleResponse,
  PostgrestMaybeSingleResponse,
  QueryData,
  QueryError,
  QueryResult,
  AuthSession,
  AuthUser,
} from '@supabase/supabase-js'

export type {
  Session,
  User,
  Provider,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  AuthResponse,
  UserResponse,
} from '@supabase/auth-js'

export { AuthError, AuthApiError } from '@supabase/auth-js'

export {
  RealtimeChannel,
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  REALTIME_PRESENCE_LISTEN_EVENTS,
  REALTIME_SUBSCRIBE_STATES,
} from '@supabase/realtime-js'

export type { RealtimePostgresChangesPayload } from '@supabase/realtime-js'
