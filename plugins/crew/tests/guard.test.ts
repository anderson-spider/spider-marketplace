import { expect, test } from 'claude-code/testing'
import { deniedWrite } from '../hooks/guard'

test('the architect writes markdown under .crew only', () => {
  expect(deniedWrite('crew:architect', '.crew/plans/login.md')).toBeUndefined()
  expect(deniedWrite('crew:architect', '/repo/.crew/reviews/pr.md')).toBeUndefined()
  expect(deniedWrite('crew:architect', 'docs/plan.md')).toContain('.crew/')
  expect(deniedWrite('crew:architect', '.crew/app.ts')).toContain('.crew/')
  expect(deniedWrite('crew:architect', '.crew/../src/app.md')).toContain('.crew/')
})

test('the tester writes test files only', () => {
  for (const path of ['tests/app.test.ts', 'src/test/java/FooTest.kt', 'pkg/test_app.py', 'app/src/androidTest/Foo.kt', 'a/b.spec.js']) {
    expect(deniedWrite('crew:tester', path)).toBeUndefined()
  }
  expect(deniedWrite('crew:tester', 'src/app.ts')).toContain('test files')
})

test('other agents are not held', () => {
  expect(deniedWrite('crew:developer', 'src/app.ts')).toBeUndefined()
  expect(deniedWrite('general-purpose', 'src/app.ts')).toBeUndefined()
})
