# crew

Registers four subagent types in `session.start`, each `crew:<name>` with a fixed model and tool allowlist.

| Agent | Model | Tools | Role |
| --- | --- | --- | --- |
| `code-reader` | haiku | Read, Grep, Glob | finds and explains code; returns `path:line` summaries |
| `research` | haiku | Read, Grep, Glob, Edit, Write, WebSearch, WebFetch, Context7, terminal-browser and Claude in Chrome tools | researches docs and the web, browses pages, writes findings and docs |
| `developer` | sonnet | Read, Grep, Glob, Edit, Write, Bash | implements a spec and runs its tests |
| `reviewer` | opus | Read, Grep, Glob, Bash | reviews a diff; read-only, never edits |

- `hooks/agents.ts` is pure data (`SPECIALISTS`); `hooks/register.tsx` holds the one `$.agent.register` call.
- Models are aliases (`haiku`, `sonnet`, `opus`), so they follow the newest model of each family.
- `tests/agents.test.ts` checks the table; `tests/register.test.ts` runs `session.start` through the test host.
- Browser and MCP tool names are listed explicitly (no wildcard); one a session does not have connected is unavailable to the agent.
- Names stay short and avoid "advisor" and "architect": Flightdeck shows the type (`crew:<name>`) on a narrow card and files any type matching its `architectPattern` under its architect panel, not as a card.
