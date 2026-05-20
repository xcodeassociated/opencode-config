---
name: firecrawl-first
description: "Researcher-only resilient web workflow. Use Firecrawl first, then mandatory SearXNG/WebFetch fallback on timeouts, empty pages, oversized crawls, or tool errors."
license: MIT
---

# Firecrawl First, Fallback Required

Researcher-only online research workflow. Firecrawl is preferred, but failure there is not a final answer while other retrieval paths exist.

## Use When

- The task needs online/current/external facts.
- A source URL must be read.
- Search results must be expanded into usable evidence.
- Firecrawl may timeout, return empty content, hit anti-bot handling, or be too broad.

## Do Not Use For

- Local repo inspection.
- Business facts that only the repo or human can answer.
- Non-research agents. They must delegate to `@researcher`.

## URL Acquisition Ladder

1. Use Firecrawl scrape/extract for the specific URL when appropriate.
2. If Firecrawl fails, times out, returns empty/irrelevant content, or reports size/tool problems, fetch the same URL with `webfetch`.
3. If incomplete, try SearXNG URL-read/content tooling when available.
4. If still incomplete, search for the same source/title/domain and fetch the best reachable mirror or official alternative.
5. Report failure only after at least one independent fallback was attempted or explicitly unavailable.

## Search Ladder

1. Use SearXNG for discovery when available.
2. Use Firecrawl search/map only for focused source discovery, not broad whole-site crawls by default.
3. Use built-in web search as final discovery fallback.
4. Fetch selected results through the URL ladder.

## Crawl Discipline

- Prefer exact URLs and narrow searches before crawl/map.
- Do not start whole-site crawl unless the brief requires inventory.
- Limit scope: domain/path, max pages, depth, and content types.
- For docs, fetch the target page plus nearby/versioned pages only when needed.
- For large sites, use sitemap/search first, then fetch selected pages.

## Timeout / Error Handling

When Firecrawl fails:

- Record source, operation, error type, and fallback used.
- Continue through fallback before reporting failure.
- If all tools fail, return partial findings, attempted paths, and what evidence is missing.
- Never answer from unsupported memory when evidence was required.

## Source Quality

- Prefer official docs, release notes, specs, source repos, vendor security advisories, standards, and authoritative project pages.
- Use blogs/forums only for secondary context unless no official source exists.
- For current versions, check package registry/release source plus official docs when possible.
- For conflicting facts, cite/record both and state which source is more authoritative.

## Report Format

```md
Research question:
Sources checked:
Primary evidence:
Fallbacks used:
Findings:
Uncertainty / missing evidence:
Recommended next step:
```
