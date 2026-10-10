import { expect, test } from 'claude-code/testing'
import { SPECIALISTS } from '../hooks/agents'

const by = (name: string) => SPECIALISTS.find(s => s.name === name)

test('each specialist runs on its model', () => {
  expect(by('code-reader')?.model).toBe('haiku')
  expect(by('doc-writer')?.model).toBe('haiku')
  expect(by('developer')?.model).toBe('sonnet')
  expect(by('reviewer')?.model).toBe('opus')
})

test('code reader and reviewer cannot edit files', () => {
  for (const name of ['code-reader', 'reviewer']) {
    const tools = by(name)?.tools ?? []
    expect(tools).not.toContain('Edit')
    expect(tools).not.toContain('Write')
  }
})

test('names are unique', () => {
  const names = SPECIALISTS.map(s => s.name)
  expect(new Set(names).size).toBe(names.length)
})
