import { expect, test } from 'claude-code/testing'

const agents = [
  { id: 'a1', type: 'crew:architect' },
  { id: 't1', type: 'crew:tester' },
  { id: 'd1', type: 'crew:developer' },
]

test('session start registers the six specialists with their models', async ($, on) => {
  const registered: { name: string; model?: string; effort?: string | number; tools?: readonly string[] }[] = []

  on('agent.register', (_$, e) => (registered.push(e), { value: { agent: `crew:${e.name}` } }))
  on('session.start', (_$, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/proj', surface: 'terminal', isInteractive: true } as never)

  expect(registered.map(a => [a.name, a.model])).toEqual([
    ['code-reader', 'haiku'],
    ['research', 'haiku'],
    ['designer', 'sonnet'],
    ['developer', 'sonnet'],
    ['tester', 'sonnet'],
    ['architect', 'opus'],
  ])
  expect(registered.find(a => a.name === 'architect')?.tools).not.toContain('Edit')
  expect(registered.find(a => a.name === 'architect')?.tools).toContain('Write')
  expect(registered.find(a => a.name === 'architect')?.effort).toBe('high')
})

test('a write outside the agent\'s lane is denied, the main loop and other agents pass', async ($, on) => {
  on('agent.list', () => ({ value: agents }) as never)
  on('tool.call', () => ({ result: 'written' }))

  const call = (agentId: string | undefined, file_path: string) => $.tool.call({ tool: 'Write', agentId, file_path } as never)

  expect(await call('a1', 'src/app.ts')).toHaveProperty('deny')
  expect(await call('a1', '.crew/plans/plan.md')).not.toHaveProperty('deny')
  expect(await call('t1', 'src/app.ts')).toHaveProperty('deny')
  expect(await call('t1', 'tests/app.test.ts')).not.toHaveProperty('deny')
  expect(await call('d1', 'src/app.ts')).not.toHaveProperty('deny')
  expect(await call(undefined, 'src/app.ts')).not.toHaveProperty('deny')
})
