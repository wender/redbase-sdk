# Changelog

All notable changes to `@redbase/sdk` are documented here.

## 0.2.1 (2026-10-09)

### Changed

- `engines.node` is now `>=22`. supabase-js realtime needs a native
  `WebSocket` global, which Node provides from 22 onward. On Node 20,
  `createClient` (5 of 9 tests) fails; all tests pass on Node 22.
  Browsers already have `WebSocket` and are unchanged. A `ws` / custom
  transport fallback was not added: this SDK ships to browsers,
  `createClient` is synchronous, and a Node-only `ws` import is easy to
  leak into client bundles.
- README notes the Node 22 requirement (no CI matrix in this repo).

## 0.2.0 (2026-10-06)

### Added

- `createClient(url, key, { app })`: new optional `app` option. When set,
  `auth.signUp` merges `{ app }` into `options.data`, so new users get
  `user_metadata.app` and RedBase can brand their auth emails. A `data.app`
  passed by the caller wins. Without the option, behaviour is unchanged.
- `withAppMetadata(credentials, app)` helper export.
- Vitest test suite (`npm test`).

## 0.1.0

- Initial release: `createClient` wrapping `@supabase/supabase-js` with an
  `email.send()` client for the RedBase email worker.
