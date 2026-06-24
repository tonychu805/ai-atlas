# AI Atlas — Experience Design & Knowledge Base Spec

*How the site teaches a motivated non-expert, and how the glossary works as a knowledge-management system rather than an appendix.*

---

## 1. Audience & the core bet

**Primary audience: the motivated outsider.** Investors, students, software engineers, journalists, policy people, curious generalists. Smart and technical-ish, but *not* chip people. They don't want a spec lookup — they want to genuinely understand how the whole thing works, end to end.

**Secondary: industry insiders**, who'll use it as a reference. Don't design *for* them, but don't get in their way (let them skip to depth instantly).

**The core bet:** *progressive disclosure on a single knowledge graph.* Every concept leads with a plain one-liner and expands to depth; every jargon term links into the glossary; every page shows what it connects to. Land anywhere → drill to bedrock → never hit an undefined term.

**The central tension** is depth vs. approachability. Resolve it with **layered reading levels**, never by dumbing content down. The same page serves a beginner and an expert; they just stop at different depths.

---

## 2. Design principles (the rules everything obeys)

1. **Plain-language first, jargon on tap.** Every entry opens with a sentence a non-expert understands. Acronyms are never used before they're expanded. Technical terms are tappable → glossary popover, inline, without leaving the page.
2. **Layered depth (L1 / L2 / L3).** Each concept has three levels: **L1** a one-liner + analogy; **L2** the working explanation (how/why); **L3** full technical detail, specs, and data. The reader picks the depth; the default level is a global setting (see §7).
3. **Show the thing.** Visual-first. A non-expert understands a labeled diagram of CoWoS or the litho loop faster than three paragraphs. Diagrams, the value-chain map, exploded BOM views.
4. **Make the connections navigable.** The atlas's whole value is relationships. Every page has a "connects to" rail: a chip → its HBM → the HBM supplier → the fab → the EUV tool. The graph *is* the site.
5. **Always answer "why does this matter."** Every component/process gets a short stakes note — the bottleneck, who controls it, the geopolitics. This is the hook that turns a curious outsider into an engaged reader.
6. **Provenance in the open.** Show confidence and source inline. It teaches healthy skepticism and is the credibility differentiator versus a scraped spec sheet.
7. **Guided paths *and* free roam.** Curated learning paths for newcomers ("How an AI chip is made, fab to rack") plus the open map for explorers. Newcomers need a hand; experts need a map.

---

## 3. Information architecture

**Entry points**
- **The Map** — the interactive, Humanoid-Atlas-style overview.
- **Learning Paths** — guided, linear tours for newcomers.
- **Knowledge Base / Glossary** — browsable concept library.
- **Universal search** — across terms, products, suppliers, processes.

**Page types (all are just views onto graph nodes)**
- Product page (a chip)
- Process page (e.g., photolithography)
- Component / material page
- Supplier / company page
- Value-chain stage page
- **Concept / term page** — a glossary entry, treated as a first-class page, not a tooltip-only blurb.

The unifying idea: **everything is a node in one graph.** Pages are views; the glossary is the same graph surfaced as definitions. There is no separate "data" and "glossary" silo.

---

## 4. The page pattern, concretely (example: HBM)

- **L1 (always visible):** "Stacks of memory chips wired straight through with vertical channels, mounted right next to the processor so data has almost no distance to travel." + analogy: *a parking garage instead of a parking lot — same cars, far less walking.*
- **L2 (one tap):** why bandwidth matters for AI, how stacking + TSVs work, why it sits on the interposer.
- **L3 (one more tap):** capacity/bandwidth specs, the BOM, the SK Hynix/Samsung/Micron split, the CoWoS dependency.
- **Inline:** every term (TSV, interposer, CoWoS, bandwidth) is a glossary link.
- **"Why it matters" callout:** HBM + packaging now dominate accelerator cost; supply is a chokepoint.
- **"Connects to" rail:** ← used by NVIDIA B200 · → made by SK Hynix · → needs CoWoS packaging · → competes with GDDR.

---

## 5. The Knowledge Base / Glossary system

This is the management layer you asked for. Design it as a **first-class entity in the same data model** as Product/Supplier/Source — not a separate wiki.

### 5a. The `Term` record
```json
{
  "id": "term-euv",
  "term": "Extreme Ultraviolet Lithography",
  "aliases": ["EUV", "EUVL"],
  "acronym_expansion": "Extreme Ultraviolet",
  "category": "process",          // process | component | material | concept | metric | org_type
  "definitions": {
    "l1_plain": "A way of printing chip patterns using extremely short-wavelength light, fine enough to draw the tiniest modern features.",
    "l2_working": "Uses 13.5nm light generated from tin plasma, reflected through mirrors in vacuum, to pattern leading-edge layers DUV can't resolve in one pass.",
    "l3_technical": "..."
  },
  "analogy": "Like switching from a fat marker to a needle-fine pen to write smaller.",
  "relations": [
    { "type": "broader", "target": "term-photolithography" },
    { "type": "part_of", "target": "stage-front-end-fab" },
    { "type": "see_also", "target": "term-high-na-euv" }
  ],
  "related_entities": ["asml", "stage-front-end-fab"],
  "sources": ["src-..."],
  "status": "published",          // draft | reviewed | published
  "last_verified": "2026-06"
}
```

### 5b. The principles that make it a *system*, not a dictionary
- **Single source of truth.** A term is defined exactly once. Everywhere it appears site-wide, it links to that one record. Edit once → propagates everywhere. This is the core "manage all knowledge" payoff.
- **Auto-linking pipeline.** A build step scans rendered content for known terms + aliases and links the first occurrence on each page to its glossary entry. Keeps linking consistent at scale without manual tagging.
- **Relationships, not just definitions.** `broader` / `narrower` / `part_of` / `see_also` edges turn the glossary into a navigable concept graph (EUV → broader: photolithography → part_of: front-end fab). That graph powers both the "connects to" rail and the learning paths.
- **Reuse the provenance layer.** Terms carry `sources[]` exactly like products do. Same confidence discipline.
- **Coverage tracking.** Since every term has L1/L2/L3 slots and a `status`, you can report exactly what's missing — which terms lack an L1, what's still `draft`. Ideal as a recurring Cowork task.

### 5c. Tooling recommendation
Store terms as **markdown files with YAML frontmatter in the same git repo** as the product/supplier JSON. Reasons: it matches the JSON-in-git decision, keeps glossary and data co-located and cross-linkable, gives clean diffs and review workflow, and lets writers edit prose comfortably. Promote to a headless CMS only if non-technical contributors join later.

---

## 6. Integration with the existing schema
- `Term` joins `Product`, `Supplier`, `Source` as a core entity; all share the same `Source` provenance records.
- Cross-cutting attributes from the taxonomy doc (`process_node`, `transistor_arch`, `integration_level`, etc.) each get a matching `Term` so any attribute value is itself explainable.
- Products may list explicit `key_terms[]`; everything else links via the auto-linker.
- Value-chain stages and process pages are graph nodes that terms can be `part_of`.

---

## 7. Open decisions
1. **Default reading level** — open pages at L1 (best for the stated audience) or L2 (faster for returners)? Recommend L1 with a sticky global toggle.
2. **Glossary tooling** — markdown-in-git (recommended) vs. CMS.
3. **Learning paths** — build a few at MVP (recommended: one flagship "fab-to-rack" path) or defer until the node library is dense.
4. **Term granularity** — one entry per concept vs. splitting closely related terms (EUV vs. High-NA EUV). Recommend: separate entries linked by `see_also` when each has a distinct supply chain or stakes.
