import type { Register } from 'claude-code'
import { SPECIALISTS } from './agents'
import { deniedWrite } from './guard'

export const register: Register = (on) => {
  on('session.start', async ($, e, next) => {
    for (const agent of SPECIALISTS) {
      await $.agent.register({ ...agent, tools: [...agent.tools] })
    }
    return next(e)
  })

  // The main loop has no agentId and is never held; a subagent is held by its type's rule in guard.ts.
  for (const tool of ['Write', 'Edit'] as const) {
    on('tool.call', { tool }, async ($, e, next) => {
      if (!e.agentId) return next(e)

      const agents = await $.agent.list()
      const type = agents.find(agent => agent.id === e.agentId)?.type
      const deny = type === undefined ? undefined : deniedWrite(type, String(e.file_path ?? ''))

      return deny === undefined ? next(e) : { deny }
    }).catch(($, e, next) => {
      // A subagent whose write could not be checked is held; the main loop is never blocked by this guard.
      if (next.called || !e.agentId) return next(e)
      return { deny: 'crew could not check this write, so it was not made' }
    })
  }
}
