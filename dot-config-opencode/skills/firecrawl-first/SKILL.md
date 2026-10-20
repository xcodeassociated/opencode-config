---
name: firecrawl-first
description: Fast web research with Firecrawl as the first choice, SearXNG as fallback, and local WebSearch last; a single good source is enough.
license: MIT
---

# Fast external research

1. **Use Firecrawl first** when online retrieval is needed: `firecrawl_search` for topics, `firecrawl_scrape` for known URLs, or `firecrawl_developer_search` for suitable coding questions.
2. **Stop when you have enough evidence.** One credible and relevant source is sufficient in ordinary cases. Do not fetch a second source by default.
3. **Fallback order:** Firecrawl → SearXNG → local `websearch` (last resort). Only progress to the next tool if the current one fails, is unavailable, or is insufficient. Do not call every provider automatically.
4. For a URL that Firecrawl cannot scrape, `webfetch` is an acceptable fetching fallback. Avoid deep crawling and unnecessary repeated attempts.
5. If evidence conflicts, is outdated or is high-stakes, verify further as needed. Be candid about uncertainty and supply the URL(s) used.

The always-loaded `researcher` agent prompt defines the complete workflow; this skill should not add extra steps or source requirements.
