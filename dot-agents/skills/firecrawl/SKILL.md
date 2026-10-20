---
name: firecrawl
description: "Use Firecrawl MCP for web search and page scraping. Crawl only when the task needs multiple pages from a site."
---

# Firecrawl

Use the configured Firecrawl MCP when a task needs current web information or page content. Follow the available tools’ schemas; tool prefixes may vary between agents.

- **Search** (`firecrawl_search`): find relevant URLs with a focused query and a small result limit.
- **Scrape** (`firecrawl_scrape`): read a known URL. Prefer Markdown and fetch only the pages needed to answer the question.
- **Crawl** (`firecrawl_crawl`): avoid by default—it is expensive. Use only when the task requires a collection of pages that targeted search and scraping cannot reasonably provide. Limit paths, page count, and depth.

Prefer authoritative sources, read relevant pages before drawing conclusions, and cite their URLs. If an operation is unavailable or fails, use another configured search or fetch tool, such as SearXNG, rather than repeatedly retrying.
