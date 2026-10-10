# crew

Registers six subagent types in `session.start`, each `crew:<name>` with a fixed model and tool allowlist.

| Agent | Model | Tools | Role |
| --- | --- | --- | --- |
| `code-reader` | haiku | Read, Grep, Glob | finds and explains code; returns `path:line` summaries |
| `research` | haiku | Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Context7, terminal-browser and Claude in Chrome tools | researches docs and the web, browses pages, writes findings and docs |
| `designer` | sonnet | Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Context7, terminal-browser and Claude in Chrome tools | specifies the UI and edits styles and layout |
| `developer` | sonnet | Read, Grep, Glob, Edit, Write, Bash | implements a spec and runs its tests |
| `tester` | sonnet | Read, Grep, Glob, Edit, Write, Bash | reproduces, writes tests, runs the suite; never changes production code |
| `architect` | opus | Read, Grep, Glob, Write, Bash | plans and reviews; writes `.crew/**/*.md` only, never code |

- `hooks/agents.ts` is pure data (`SPECIALISTS`); `hooks/register.tsx` holds the one `$.agent.register` call.
- Models are aliases (`haiku`, `sonnet`, `opus`), so they follow the newest model of each family.
- `tests/agents.test.ts` checks the table; `tests/register.test.ts` runs `session.start` through the test host.
- Browser and MCP tool names are listed explicitly (no wildcard); one a session does not have connected is unavailable to the agent.
- Names stay short and avoid "advisor" and "architect" except for `architect` itself: Flightdeck shows the type (`crew:<name>`) on a narrow card and files any type matching its `architectPattern` under its architect panel, not as a card.
- `architect` is named so on purpose: it matches Flightdeck's default `architectPattern`, so its runs show in the ARCHITECT panel as consults, not as cards.
- `hooks/guard.ts` holds the write rules and `register.tsx` enforces them in a `tool.call` hook on `Write` and `Edit`: the architect may write Markdown under `.crew/` only (plans and reviews, unversioned; the brainstorm skill adds `.crew/` to the root `.gitignore` when it is not ignored), the tester test files only. The hook finds the caller through `e.agentId` and `$.agent.list()`, never blocks the main loop, and holds a subagent whose write it could not check.
- Not enforced, prompt only: the designer leaves logic and tests alone, and the architect's `Bash` is not screened for writes.
- `skills/brainstorm/SKILL.md` tells Claude how to plan with these agents (frame, gather in parallel, diverge, challenge with `architect`, plan); keep its agent names in step with `hooks/agents.ts`.
