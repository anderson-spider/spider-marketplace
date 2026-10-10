import type { Register } from 'claude-code'
import { SPECIALISTS } from './agents'

export const register: Register = (on) => {
  on('session.start', async ($, e, next) => {
    for (const agent of SPECIALISTS) {
      await $.agent.register({ ...agent, tools: [...agent.tools] })
    }
    return next(e)
  })
}
