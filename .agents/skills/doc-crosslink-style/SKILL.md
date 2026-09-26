---
name: doc-crosslink-style
description: Weaves the cross-document link network within the same folder/branch — the "Related" section convention, bidirectional linking, and shared-concept criteria. Apply when creating or editing a document that already meets the single-document structure standard from `doc-structure-style`. Does not decide document skeleton, prose style, or technical depth — those belong to `doc-structure-style` and `doc-content-depth`.
---

# Doc Cross-Link Style

## Purpose

This skill is a companion to `doc-structure-style` and `doc-content-depth`: those two ensure **the quality of a single document** (structure, prose, depth, diagrams); this skill ensures **deliberate cross-document weaving** — turning a folder from a pile of disconnected articles into a knowledge network with real topology.

Core principle: a link between documents must be a **deliberate design decision**, never an incidental by-product. Every cross-link must be anchored to an explicitly named **shared concept** that gives the reader new context — not just "this is also a doc in the same folder."

## Table of Contents

- [1. Scope and Boundary with the Base Skills](#1-scope-and-boundary-with-the-base-skills)
- [2. The "Related" Section Convention](#2-the-related-section-convention)
- [3. Cross-Link Quality Criteria](#3-cross-link-quality-criteria)
- [4. Bidirectional Linking Rule](#4-bidirectional-linking-rule)
- [5. Path Stability and Maintenance Rules](#5-path-stability-and-maintenance-rules)
- [6. Final Checklist](#6-final-checklist)

---

## 1. Scope and Boundary with the Base Skills

- **Prerequisite:** the document already meets the single-document structure standard from `doc-structure-style` (one `# H1`, `## Table of Contents`, `[← Back to README]` footer).
- **Never touches README:** `README.md` keeps its **pure navigation index** property. This skill never forces README to contain a comparison matrix or a concept map. The cross-link web lives in the `## Related` section of each detail document, never in README.
- **No diagrams:** inherits `doc-structure-style`'s rule — never draw a Mermaid diagram unprompted, even to visualize the link network.
- **No depth decisions:** this skill never decides how much technical detail a document or its "Related" blurb should contain — that boundary belongs to `doc-content-depth`. A cross-link blurb should stay at the same depth level as the document it sits in.

---

## 2. The "Related" Section Convention

### Mandatory position

- The `## Related` section is the **last `H2` heading** of the document, placed immediately before the footer navigation, with a `---` separator above it.
- Standard end-of-page structure:

  ```markdown
  ---

  ## Related

  *   [Document title](relative-path.md) — one sentence naming the shared concept.

  ---
  [← Back to README](README.md)
  ```

### Per-entry formatting

- Each line is a bullet: **link + one sentence naming the shared concept**. Never leave a bare link list with no explanation.
- The explanation sentence must point to a specific conceptual axis (e.g. *same **Decoupling via Interface** principle*, *same **Trade-off between security and UX*** mechanism), never a generic phrase like "this one is also good" or "related to design patterns."
- Concept terminology inside the explanation sentence follows `doc-structure-style`'s prose rules: keep English technical terms in bold, never the "Vietnamese term + parenthetical English gloss" pattern.

### Linking scope

- **Prefer same-branch links first:** favor links to documents in the same folder or the same parent branch.
- **Cross-branch links are allowed** (e.g. `design_patterns` ↔ `software_architecture`) when the shared concept is genuinely strong; use relative paths (`../`) and keep stable `snake_case` naming.

---

## 3. Cross-Link Quality Criteria

### Optimize for quality, not quantity

- Each document carries **1–3 high-quality cross-links**. Never pad the count with filler links.
- If a document genuinely has no meaningful conceptual link, it is fine to skip the `## Related` section entirely — but that must be a deliberate decision, not an oversight.

### "Worth linking" criteria

A link is worth placing when it satisfies at least one of:

1. **Same abstraction axis:** both documents operate on the same underlying principle (e.g. *Separation of Concerns*, *Lifecycle*, *Boundary*, *Trade-off*).
2. **Sequential relationship:** one document is a prerequisite for, or a continuation of, the other (e.g. server-side Authorization Code Flow → protecting the token inside an SPA).
3. **Contrasting relationship:** both documents solve the same problem via a different approach, and the comparison is worth making explicit (e.g. storing a token via Cookie vs. WebCrypto).

### Disqualifying conditions

Do not place a cross-link when:

- The two documents only share a surface-level topic without sharing a real conceptual axis.
- The link is purely navigational — README already owns that job.
- Explaining the shared concept would feel forced or strained, and would break the reading flow.

---

## 4. Bidirectional Linking Rule

- When adding link `A → B`, you **must** check and add the reverse `B → A` in `B`'s `## Related` section (if not already present).
- The two explanation sentences **do not need to be identical** — each side frames the shared concept from its own document's point of view.
- When **removing** link `A → B`, the corresponding reverse link at `B` must be removed too.

---

## 5. Path Stability and Maintenance Rules

- All cross-links use **relative paths** from the current file's location — never absolute paths from the repo root.
- When a document is renamed or moved, **every `## Related` section in sibling documents must be audited** and updated to fix links pointing at it.
- File/folder naming stays stable under `doc-structure-style`'s `snake_case` convention — renaming without cause is the root cause of dead links.
- Before closing out an editing session, run a link-validity pass (one scan is enough; use `grep` or a script if the environment supports it).

---

## 6. Final Checklist

A document only counts as compliant on cross-linking once:

- [ ] The `## Related` section (if present) is the last `H2` before the footer, with a `---` separator; every link carries one sentence naming the shared concept; no bare links.
- [ ] Link count is within the 1–3 range; every link satisfies at least one quality criterion from §3.
- [ ] Bidirectionality holds: every `A → B` link has a matching `B → A` link.
- [ ] Relative paths are correct, no dead links; `snake_case` naming is respected.
- [ ] README at every level stays free of comparison matrices or diagrams — pure navigation only.
- [ ] No "Related" blurb pulled the document's depth level higher than the section it sits in (`doc-content-depth`'s boundary was respected).