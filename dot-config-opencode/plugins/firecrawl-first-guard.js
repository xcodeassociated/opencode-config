// OpenCode loads this local plugin automatically from ~/.config/opencode/plugins/.
// Enforces an actual Firecrawl retrieval attempt before competing web tool calls.
// The `build` agent already has these web tools denied. The `researcher` agent has them allowed.
export const FirecrawlFirstGuard = async () => {
  const firecrawlAttempted = new Set();

  // Include both MCP tool-name layouts: firecrawl_search and
  // firecrawl_firecrawl_search (OpenCode prefixes the MCP server name).
  const isFirecrawlRetrieval = (name) =>
    /^firecrawl_(?:firecrawl_)?(?:search|scrape|developer_search|map|crawl|extract|research_[a-z_]+)(?:$|_)/i.test(name);

  const isAlternativeWebTool = (name) =>
    name === "webfetch" ||
    name === "websearch" ||
    /^searxng(?:_|$)/i.test(name) ||
    /^duckduckgo(?:_|$)/i.test(name);

  return {
    "tool.execute.before": async ({ tool, sessionID }) => {
      if (isFirecrawlRetrieval(tool)) {
        // Mark the attempted retrieval, not success. Failed Firecrawl calls
        // are a legitimate reason to switch to a fallback tool.
        firecrawlAttempted.add(sessionID);
        return;
      }

      if (isAlternativeWebTool(tool) && !firecrawlAttempted.has(sessionID)) {
        throw new Error(
          "Firecrawl-first policy: try firecrawl_firecrawl_search (for queries) " +
            "or firecrawl_firecrawl_scrape (for URLs) before " + tool + ". " +
            "If Firecrawl is disconnected, report the MCP outage instead of bypassing it."
        );
      }
    },
  };
};
