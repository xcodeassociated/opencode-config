import { Plugin } from "@opencode/plugin";

// Enforce Firecrawl-first retrieval for DIRECT tools in OpenCode V2.
// The MCP servers' codemode:false setting is intentional: a Code Mode
// wrapper would hide nested MCP executions from this tool hook.
export default Plugin.define({
  id: "firecrawl-first-guard",
  async setup(ctx) {
    // Per-session state. One attempted Firecrawl retrieval is enough to permit
    // fallback tools in that session, matching the original V1 guard policy.
    const attempted = new Set();
    const retrieval = /^firecrawl_(?:firecrawl_)?(?:search|scrape|developer_search|map|crawl|extract|research_[a-z_]+)(?:$|_)/i;
    const alternative = /^(?:searxng|duckduckgo)(?:_|$)/i;

    await ctx.tool.hook("execute.before", (event) => {
      const { tool, sessionID } = event;
      if (retrieval.test(tool)) {
        attempted.add(sessionID);
        return;
      }

      if (tool !== "webfetch" && tool !== "websearch" && !alternative.test(tool)) return;
      if (attempted.has(sessionID)) return;

      throw new Error(
        "Firecrawl-first policy: call firecrawl_search (or " +
        "firecrawl_firecrawl_search), or firecrawl_scrape for a known URL, " +
        "before " + tool + ". If Firecrawl is disconnected, report " +
        "the MCP outage instead of bypassing it."
      );
    });
  },
});
