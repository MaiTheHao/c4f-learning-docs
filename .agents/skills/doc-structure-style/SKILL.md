---
name: doc-structure-style
description: Enforces document structure, naming conventions, Mermaid diagram policy, code block formatting, tables/GitHub alerts, and Vietnamese technical prose style for all Markdown learning documentation in the project. Use whenever creating or editing any README.md or detail doc, inserting a Mermaid diagram, formatting a code block, or writing/reviewing Vietnamese technical sentences. This skill governs HOW content is shaped on the page — it does NOT decide how much technical depth or which implementation specifics belong in the content. For that, use the companion skill `doc-content-depth`.
---

# Doc Structure & Style

## Purpose

This skill is the single source of truth for the **presentation layer** of every Markdown document in the project: file/folder naming, README rules, detail-doc skeleton, Mermaid policy, code-block formatting, tables/alerts, and Vietnamese technical prose conventions. It never decides *what* technical facts to include or *how deep* to go — that is `doc-content-depth`'s job. Run `doc-content-depth` first (or in parallel) when the content itself is new or imported from research; run this skill to make sure the result is shaped correctly.

## Table of Contents

- [1. Naming Conventions](#1-naming-conventions)
- [2. README.md Rules](#2-readmemd-rules)
- [3. Detail Document Skeleton](#3-detail-document-skeleton)
- [4. Mermaid Diagram Policy](#4-mermaid-diagram-policy)
- [5. Code Block Formatting](#5-code-block-formatting)
- [6. Tables & GitHub Alerts](#6-tables--github-alerts)
- [7. Vietnamese Technical Prose Style](#7-vietnamese-technical-prose-style)
- [8. Cross-Document Weaving](#8-cross-document-weaving)
- [9. Handoff to doc-content-depth](#9-handoff-to-doc-content-depth)
- [10. Final Checklist](#10-final-checklist)

---

## 1. Naming Conventions

- Root folders: numeric prefix + `snake_case` (e.g. `01_fundamentals/`, `02_architecture/`).
- Subfolders and files: `snake_case`, lowercase only, no spaces or special characters.
- Static assets (images, attachments): centralized under `assets/`.

---

## 2. README.md Rules

`README.md` is a **pure navigation index**. Nothing else. To keep it from turning into a second copy of the content:

**Mandatory continuous abstract**
- Immediately after the `# H1` title (or after a `> [!IMPORTANT]` source citation box), include exactly **one abstract paragraph**.
- The abstract must be **one single continuous paragraph of prose** giving the big-picture overview of the module/folder. No fragmenting into multiple paragraphs, no bullet list.

**Pure-index property**
- README only provides a table of contents and links into child documents.
- **Never include comparison/compare-matrix sections** between topics or design patterns inside README. Any detailed comparison belongs in the relevant child document or its own dedicated doc.
- **Never embed a Mermaid diagram** and **never embed a code block** in README.

**Formatting of each subsection entry**
- Each subsection (corresponding to one detail article) may have a short intro.
- That intro **must be a single cohesive paragraph**.
- **Never use bulleted lists** of the form `* Purpose: ... * Characteristics: ... * Benefit: ...` inside README — nested lists break the index layout.
- End the paragraph with a clear navigation link to the detail doc, e.g. `[See Observer Pattern in detail](./observer.md)`.

---

## 3. Detail Document Skeleton

Every detail (non-README) document follows this exact skeleton:

- **Title:** exactly one `# H1` at the top.
- **Internal TOC:** `## Table of Contents` placed immediately after the H1, containing only anchor links to the document's `H2` headings.
- **Section separators:** a horizontal rule `---` before every `H2`.
- **Footer navigation:** every document ends with:
  ```markdown
  ---
  [← Back to README](README.md)
  ```

---

## 4. Mermaid Diagram Policy

- **Default rule: do NOT draw a Mermaid diagram unless the user explicitly asks for one.** Default to concise prose and logical tables instead — this keeps documents light. (Whether a diagram, once requested, should show version-specific or abstracted detail is a `doc-content-depth` decision, not this skill's.)
- **When a diagram is requested:** no rigid technical or layout convention is enforced — freely choose theme, layout, and syntax style that best fits the content and context.

---

## 5. Code Block Formatting

These are *presentation* rules for code blocks. Whether a snippet should exist at all, and how much implementation detail it should carry, is decided by `doc-content-depth` (see its "boilerplate vs. structural snippet" guidance).

- Always declare the language tag (`java`, `python`, `typescript`, `bash`, ...).
- Always precede the block with one short descriptive sentence.
- Any Vietnamese text inside a code block (comments, message strings) must use full, correct diacritics — never unaccented Vietnamese.
- Prefer short interface/boundary/structural snippets over long installation boilerplate — the length ceiling is a formatting concern; the *content* ceiling (which specific values/config are allowed to appear) is `doc-content-depth`'s call.

---

## 6. Tables & GitHub Alerts

**Tables**
- Use tables to explain complex flows or summarize component roles:
  ```markdown
  | Component | Role | Detailed responsibility |
  | :--- | :--- | :--- |
  ```
- Use **bold** for business/domain terms and `inline code` for file names, commands, classes, variables, or data types.

**GitHub Alerts**
- Prefer GitHub Alerts over plain blockquotes.
- Use the correct type for the intent: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`.

---

## 7. Vietnamese Technical Prose Style

**Voice and terminology**
- The whole document is written in natural Vietnamese technical prose — clear, direct, and engineering-minded.
- Keep English technical terms in their original form (**bold** or `inline code`). Only translate to Vietnamese when a precise, community-accepted translation already exists.
- **Avoid the "Vietnamese term + parenthetical English gloss" pattern** (e.g. avoid *"sự đánh đổi (trade-offs)"*, *"liên kết lỏng (loose coupling)"*). This is redundant and fragments the sentence. Use the English term directly inside the Vietnamese sentence instead:
  - *Weak:* "Mẫu này giúp giảm sự phụ thuộc chặt chẽ (tight coupling) và tăng tính gắn kết (cohesion)."
  - *Correct:* "Mẫu này giúp giảm thiểu **Tight Coupling** và gia tăng **Cohesion** giữa các mô-đun."
- Standard terms that always stay in English: **Trade-off**, **Coupling**, **Cohesion**, **Fitness Functions**, **Runtime**, **Compile-time**, **Subject**, **Observer**, **Context**, **Strategy**, **Microservices**, **Monolith**, **ADR**, **CI/CD**, etc.

**Technical storytelling structure**
- **Context before definition:** prefer the flow `Context → Motivation → Definition` over opening with an abstract definition.
- **Reasoning flow:** maintain `Why → How → Where → Trade-off` throughout the analysis.
- **Sentence rhythm:** alternate short, decisive sentences with longer explanatory ones; avoid repeating the same sentence-opening pattern more than twice in one article.
- **Quantified language:** prefer measurable terms (`latency`, `throughput`, `memory footprint`, `O(n)`) over vague adjectives like "very fast" or "extremely optimal."

---

## 8. Cross-Document Weaving

This skill only standardizes a **single document**: H1/TOC/`---` structure, prose style, Mermaid, code blocks. To weave a **semantic cross-link network** between documents — a `## Related` section, bidirectional links, shared-concept criteria — use the companion skill **`crosslink-doc-style`**.

- **Prerequisite for `crosslink-doc-style`:** the document must already meet this skill's single-document standard (one `# H1`, `## Table of Contents`, `[← Back to README]` footer).
- **Clear boundary:** `crosslink-doc-style` never touches `README.md` and never draws Mermaid diagrams unprompted — both constraints are inherited from this skill.

---

## 9. Handoff to doc-content-depth

Formatting and depth are independent axes and must not be conflated:

| Question | Answered by |
| :--- | :--- |
| Is there one H1, a TOC, a `---` before each H2, a back-to-README footer? | `doc-structure-style` (this skill) |
| Does the README stay a pure index with no compare table, no Mermaid, no code? | `doc-structure-style` (this skill) |
| Is the prose natural Vietnamese with correct terminology handling? | `doc-structure-style` (this skill) |
| Should this paragraph mention the exact algorithm version, bit-length, or config flag? | `doc-content-depth` |
| Is this section too implementation-heavy or too vague for its stated topic? | `doc-content-depth` |

When importing deep-research material, run `doc-content-depth` on the raw content **before** or **while** shaping it with this skill's skeleton — do not format implementation-dense raw research and call it done.

---

## 10. Final Checklist

A document only counts as compliant once **all** of the following hold:

- [ ] `README.md`: one continuous abstract paragraph; no compare table; no code block; no Mermaid diagram; every subsection described as one cohesive paragraph (no list).
- [ ] Detail document: exactly one `# H1`; `## Table of Contents` right after H1 linking only to `H2`s; `---` before every `H2`; `[← Back to README](README.md)` footer.
- [ ] Mermaid: appears **only on explicit user request**; free representation style once requested.
- [ ] Code blocks: language tag declared; one-line description precedes the block; Vietnamese text inside has full diacritics; length kept to short structural snippets.
- [ ] Terminology & voice: natural Vietnamese; English technical terms preserved as-is; no "Vietnamese + parenthetical English" redundancy.
- [ ] Formatting: GitHub Alerts used correctly instead of plain blockquotes; tables well-aligned.
- [ ] Cross-linking: considered whether a `## Related` section is needed (if so, apply `crosslink-doc-style` for bidirectional links).
- [ ] Depth check delegated: nothing in the document was accepted or rejected for technical depth reasons without going through `doc-content-depth`.