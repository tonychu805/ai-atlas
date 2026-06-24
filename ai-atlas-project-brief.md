# AI Atlas — Project Brief

*Drop this in the project folder alongside `ai-atlas-schema-logic-memory.md` and point Cowork at the folder.*

## What this is
An open, comprehensive, interactive database and map of the semiconductor industry — modeled on Humanoid Atlas (humanoids.fyi), but for chips. It goes beyond cost: it links each **product** to its **BOM**, its **supplier graph** across the value chain, and its **specs**, with an explicit **provenance/confidence layer** on every estimated number.

## Why it's differentiated
Existing tools (Silicon Analysts, Epoch AI, SemiAnalysis) cover cost-decomposition slices only, and are mostly paid/closed. The opening is a **free, open, full-stack atlas** whose value is *structure and connectivity*, not raw coverage — a browsable map of how the pieces relate.

## Scope
- Long-term: the entire semiconductor industry.
- Built **depth-first**. Phase 1 = **Logic + Memory**, starting with the **data-center compute stack** (richest public data, highest interest, touches the most of the value chain).
- Resist chasing completeness. Structure beats coverage.

## Data model
Defined in `ai-atlas-schema-logic-memory.md`. Summary:
- A matrix of **product domains** (rows) × **value-chain stages** (columns: design IP/EDA, foundry, materials, equipment, packaging/OSAT, test, distribution).
- A small **graph**: `Product`, `Supplier`, `Source` entities plus typed edges (`uses`, `fabbed_by`, `packaged_by`, `succeeds`, `competes_with`).
- The keystone: **HBM is both a Memory product and a BOM line item inside Logic accelerators.** That cross-reference is the hardest and most valuable join — build it first.

## Decisions already locked
- Storage: JSON-files-in-git to start (easy diffs), not a graph DB yet.
- Compute specs normalized per-precision (FP16/FP8/FP4).
- Provenance + confidence required on contested/estimated values; hard datasheet specs can stay plain.
- Generations modeled as separate records linked by `succeeds`.
- `last_verified` date per record to surface staleness.

## Immediate next tasks (for Cowork)
1. Stand up the folder/repo structure: `products/`, `suppliers/`, `sources/`.
2. Populate **vetted, fully-sourced** records for an initial batch, e.g.: NVIDIA B200/GB200, AMD MI300X/MI355X, Google TPU (current gen), AWS Trainium; HBM3E from SK Hynix / Samsung / Micron; DDR5; one or two server CPUs (Xeon, EPYC).
3. Build the **HBM cross-reference join** before anything else.
4. Replace the illustrative placeholder numbers in the schema's worked examples with sourced values.

## Working principles
- Every estimated number carries a `source` id (even if it's your own internal model).
- Mark BOM cost estimates with ±15–20% uncertainty.
- Controlled vocabularies (enums) for `domain` and `subcategory` — no free text.
