# Changelog

All notable changes to `@redbase/sdk` are documented here.

## 0.2.0 (unreleased)

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
