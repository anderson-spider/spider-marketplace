import { expect, test } from 'claude-code/testing'

test('session start registers the four specialists with their models', async ($, on) => {
  const registered: { name: string; model?: string; tools?: readonly string[] }[] = []

  on('agent.register', (_$, e) => (registered.push(e), { value: { agent: `specialist-agents:${e.name}` } }))
  on('session.start', (_$, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/proj', surface: 'terminal', isInteractive: true } as never)

  expect(registered.map(a => [a.name, a.model])).toEqual([
    ['code-reader', 'haiku'],
    ['doc-writer', 'haiku'],
    ['developer', 'sonnet'],
    ['reviewer', 'opus'],
  ])
  expect(registered.find(a => a.name === 'reviewer')?.tools).not.toContain('Edit')
})
