import { describe, expect, it } from 'vitest'
import { createClient, withAppMetadata } from '../src/index'

const API_URL = 'https://api.example.test'
const KEY = 'test-anon-key'

/** A fetch stub that records GoTrue /signup request bodies. */
function recordingFetch() {
  const bodies: Array<Record<string, unknown>> = []
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (url.includes('/auth/v1/signup')) {
      bodies.push(JSON.parse(String(init?.body ?? '{}')))
    }
    return new Response(JSON.stringify({ id: 'u1', email: 'a@b.c', user_metadata: {} }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }) as typeof fetch
  return { bodies, fetchImpl }
}

function client(fetchImpl: typeof fetch, app?: string) {
  return createClient(API_URL, KEY, {
    ...(app !== undefined ? { app } : {}),
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: fetchImpl },
  })
}

describe('withAppMetadata', () => {
  it('adds data.app when missing', () => {
    const input = { email: 'a@b.c', password: 'pw' }
    expect(withAppMetadata(input, 'nivel')).toEqual({
      email: 'a@b.c',
      password: 'pw',
      options: { data: { app: 'nivel' } },
    })
    expect(input).toEqual({ email: 'a@b.c', password: 'pw' }) // not mutated
  })

  it('merges with existing data and options', () => {
    const out = withAppMetadata(
      { email: 'a@b.c', password: 'pw', options: { emailRedirectTo: 'https://x.test/', data: { full_name: 'A' } } },
      'nivel'
    )
    expect(out.options).toEqual({ emailRedirectTo: 'https://x.test/', data: { full_name: 'A', app: 'nivel' } })
  })

  it('keeps the caller data.app', () => {
    const input = { email: 'a@b.c', password: 'pw', options: { data: { app: 'snout' } } }
    expect(withAppMetadata(input, 'nivel')).toBe(input)
  })

  it('is a no-op without an app', () => {
    const input = { email: 'a@b.c', password: 'pw' }
    expect(withAppMetadata(input, undefined)).toBe(input)
    expect(withAppMetadata(input, '')).toBe(input)
  })
})

describe('createClient({ app })', () => {
  it('stamps user_metadata.app on signUp', async () => {
    const { bodies, fetchImpl } = recordingFetch()
    await client(fetchImpl, 'nivel').auth.signUp({
      email: 'a@b.c',
      password: 'pw',
      options: { data: { full_name: 'A' }, emailRedirectTo: 'https://nivelcerto.com.br/' },
    })
    expect(bodies).toHaveLength(1)
    expect(bodies[0].data).toEqual({ full_name: 'A', app: 'nivel' })
  })

  it('lets the caller data.app win', async () => {
    const { bodies, fetchImpl } = recordingFetch()
    await client(fetchImpl, 'nivel').auth.signUp({
      email: 'a@b.c',
      password: 'pw',
      options: { data: { app: 'other' } },
    })
    expect(bodies[0].data).toEqual({ app: 'other' })
  })

  it('does not change signUp when app is not set', async () => {
    const { bodies, fetchImpl } = recordingFetch()
    const rb = client(fetchImpl)
    await rb.auth.signUp({ email: 'a@b.c', password: 'pw' })
    expect(bodies[0].data).toEqual({})
    expect(Object.prototype.hasOwnProperty.call(rb.auth, 'signUp')).toBe(false)
  })

  it('ignores an empty/whitespace app', async () => {
    const { bodies, fetchImpl } = recordingFetch()
    await client(fetchImpl, '  ').auth.signUp({ email: 'a@b.c', password: 'pw' })
    expect(bodies[0].data).toEqual({})
  })

  it('keeps the email client', () => {
    const { fetchImpl } = recordingFetch()
    expect(typeof client(fetchImpl, 'nivel').email.send).toBe('function')
  })
})
