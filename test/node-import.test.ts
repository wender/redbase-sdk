import { execFileSync } from 'node:child_process'
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function runNode(args: string[], cwd = root): string {
  return execFileSync(process.execPath, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

describe('Node import of built ESM and CJS', () => {
  beforeAll(() => {
    execFileSync('npm', ['run', 'build'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  })

  it('imports built ESM (`node -e import(...)`)', () => {
    runNode(['--input-type=module', '-e', "await import('./dist/index.js')"])
  })

  it('requires built CJS (`node -e require(...)`)', () => {
    runNode(['-e', "require('./dist/index.cjs')"])
  })

  it('exports StorageApiError from the built ESM', () => {
    const out = runNode([
      '--input-type=module',
      '-e',
      "const m = await import('./dist/index.js'); if (typeof m.StorageApiError !== 'function') throw new Error('StorageApiError is not exported')",
    ])
    expect(out).toBe('')
  })

  it('does not re-export StorageApiError from @supabase/supabase-js', () => {
    const esm = readFileSync(join(root, 'dist/index.js'), 'utf8')
    const cjs = readFileSync(join(root, 'dist/index.cjs'), 'utf8')
    expect(esm).not.toMatch(
      /export\s*\{[^}]*\bStorageApiError\b[^}]*\}\s*from\s*['"]@supabase\/supabase-js['"]/
    )
    expect(cjs).not.toMatch(/supabase-js['"]\)\.StorageApiError|supabaseJs\.StorageApiError/)
    expect(esm).toMatch(/StorageApiError.*@supabase\/storage-js/)
  })

  it(
    'imports built ESM against supabase-js 2.97 (the version that does not export StorageApiError)',
    () => {
      const dir = mkdtempSync(join(tmpdir(), 'redbase-sdk-sb297-'))
      try {
        writeFileSync(
          join(dir, 'package.json'),
          JSON.stringify({ name: 'redbase-sdk-import-probe', private: true, type: 'module' })
        )
        execFileSync('npm', ['install', '--omit=dev', '@supabase/supabase-js@2.97.0'], {
          cwd: dir,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
        })
        cpSync(join(root, 'dist'), join(dir, 'dist'), { recursive: true })
        runNode(['--input-type=module', '-e', "await import('./dist/index.js')"], dir)
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    },
    90_000
  )
})
