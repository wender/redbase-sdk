/**
 * @rednew/redbase - RedBase client SDK
 *
 * Supabase-compatible BaaS client for Rednew apps with additional
 * email functionality.
 *
 * @packageDocumentation
 */

export { createClient, type RedbaseClient, type RedbaseClientOptions } from './client'

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
  StorageApiError,
} from '@supabase/supabase-js'

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
