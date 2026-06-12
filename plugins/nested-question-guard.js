/**
 * nested-question-guard — OpenCode plugin (two hooks, one concern:
 * nested questions must reach the human).
 *
 * Hook 1 — `tool.execute.before` on `question`:
 * The TUI surfaces `question` prompts only from the primary session and its
 * direct child sessions (anomalyco/opencode issue #7654); a `question` from a
 * deeper session (e.g. team-lead -> developer -> researcher) hangs invisibly.
 * Before any `question` call, walk the session's `parentID` chain; at depth >= 2
 * below the primary, reject the call with an instruction to return the question
 * via `Clarification Requests` for relay. Throwing here blocks the call and
 * returns the text to the model, converting a silent hang into an in-run
 * self-correction.
 *
 * Hook 2 — `tool.execute.after` on `task`:
 * Relay enforcement. When a subagent's return contains Blocking
 * `Clarification Requests` (or the Hook 1 rejection text), append a relay
 * order to the task result so the invoking model sees it inside the tool
 * output itself: answer it, ask the human with `question` (reachable from the
 * primary session and its direct delegates), or relay upward — never close the
 * task or send a final report around an unanswered Blocking question.
 *
 * Fail-open everywhere: on any SDK/shape/regex error the hooks step aside;
 * this guard must never break depth-0/1 questioning or task returns.
 *
 * Install: ships with this package into ~/.config/opencode/plugins/ (global)
 * or .opencode/plugins/ (per project). Delete once #7654 is fixed upstream.
 *
 * Verified against dev-branch sources: hook signatures from
 * packages/plugin/src/index.ts ("tool.execute.before" input
 * { tool, sessionID, callID }; "tool.execute.after" input
 * { tool, sessionID, callID, args }, output { title, output, ... });
 * child sessions carry `parentID` (packages/opencode/src/tool/task.ts).
 */

const RELAY_BANNER =
  "\n\n[nested-question-guard] This return contains Blocking clarification request(s). " +
  "Before any final report or task completion: answer them from evidence and re-delegate with " +
  "`Clarification Answers`, or ask the human with `question` now (`question` reaches the human " +
  "from the primary session and its direct delegates), or relay them upward in your own " +
  "`Clarification Requests`. A Blocking question is asked or relayed — never just quoted in a report."

function hasBlockingRequests(text) {
  if (!text || typeof text !== "string") return false
  if (text.includes("nested-question-guard: this session is nested")) return true
  const m = /Clarification Requests:[\s\S]{0,2000}?Blocking:\s*\n?([\s\S]*?)(?:\n\s*Non-blocking|\n\s*Assumptions|\n\s*Suggested|$)/i.exec(
    text,
  )
  if (!m) return false
  const lines = m[1]
    .split("\n")
    .map((l) => l.replace(/^[\s>*-]+/, "").trim())
    .filter(Boolean)
  const meaningful = lines.filter((l) => !/^(none|n\/a|nothing|empty|\.{3}|—)$/i.test(l))
  return meaningful.length > 0
}

export const NestedQuestionGuard = async ({ client }) => {
  async function depthOf(sessionID) {
    let depth = 0
    let id = sessionID
    for (let i = 0; i < 16 && id; i++) {
      const res = await client.session.get({ path: { id } })
      const session = res?.data ?? res
      const parent = session?.parentID
      if (!parent) return depth
      depth += 1
      id = parent
    }
    return depth
  }

  return {
    "tool.execute.before": async (input) => {
      if (input.tool !== "question") return
      let depth
      try {
        depth = await depthOf(input.sessionID)
      } catch {
        return // fail-open: never break depth-0/1 questioning
      }
      if (depth >= 2) {
        throw new Error(
          "nested-question-guard: this session is nested " +
            depth +
            " levels below the primary session; `question` calls from here do not surface in the TUI " +
            "(opencode issue #7654) and would hang. Do not retry `question`. Return the question to your " +
            "invoker as `Clarification Requests` (Blocking) in your report; the invoker answers it or relays " +
            "it upward — the direct delegate of the primary session can `question` the human itself.",
        )
      }
    },

    "tool.execute.after": async (input, output) => {
      try {
        if (input.tool !== "task") return
        if (!output || typeof output.output !== "string") return
        if (output.output.includes("[nested-question-guard]")) return
        if (hasBlockingRequests(output.output)) output.output += RELAY_BANNER
      } catch {
        return // fail-open: never corrupt task returns
      }
    },
  }
}
