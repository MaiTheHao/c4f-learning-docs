---
name: doc-content-depth
description: Reviews and recalibrates how much technical depth belongs in a learning document, especially content pulled from deep-research. Solves the recurring problem of research dumps injecting specific algorithm names, bit-lengths, protocol versions, cipher-suite strings, config flags, or CVE IDs into docs meant to teach foundational/base knowledge, forcing multiple manual re-prompts to abstract it back down. Use whenever importing deep-research findings into a doc, whenever a draft feels too implementation-heavy or too vague for its stated topic, or when asked to "optimize content", "trừu tượng hóa", "làm dễ hiểu hơn", or calibrate detail level. Defines 3 depth levels (Conceptual, Technical, Deep-Implementation) and a scope-matching test for which level each section should use. Pairs with `doc-structure-style`, which governs formatting only, not depth.
---

# Doc Content Depth

## Purpose

Raw deep-research output is written to be exhaustive, not to teach. It mixes the actual conceptual flow (what happens, in what order, why) together with incidental specifics (exact version numbers, bit-lengths, cipher-suite identifiers, CLI flags, CVE codes) that happened to appear in the source. When that raw mix is pasted into a document meant to build **base/foundational understanding**, the reader drowns in incidental facts and loses the flow. This skill is the review pass that separates the two and puts each piece at the depth level it belongs at.

This skill decides **what** and **how much**. `doc-structure-style` decides how the result looks on the page. Run this skill on new or imported content before, or together with, formatting.

## Table of Contents

- [1. The Problem, Illustrated](#1-the-problem-illustrated)
- [2. The Three Depth Levels](#2-the-three-depth-levels)
- [3. Scope-Matching Rule](#3-scope-matching-rule)
- [4. Decision Test Per Fact](#4-decision-test-per-fact)
- [5. The Nuance-Insertion Pattern](#5-the-nuance-insertion-pattern)
- [6. Worked Example](#6-worked-example)
- [7. Content Optimization Workflow](#7-content-optimization-workflow)
- [8. Conceptual-Family Naming Reference](#8-conceptual-family-naming-reference)
- [9. Final Checklist](#9-final-checklist)

---

## 1. The Problem, Illustrated

A typical deep-research source paragraph reads like a spec sheet: it names the exact algorithm, the exact standard, the exact bit-length, and cites its own reference — all packed into one sentence, with no distinction between what actually matters for understanding the *flow* and what is incidental provenance.

A document meant to teach the **base concept** (e.g. "how does a TLS handshake establish a shared secret?") does not need any of that provenance. It needs the actors, the sequence, and the roles they play — nothing that would change if the exact algorithm were swapped for a same-family alternative.

## 2. The Three Depth Levels

Every sentence, table cell, or code snippet in a learning document sits at exactly one of these levels. Mixing levels inside a single explanatory flow is what causes the "drowning in specs" problem.

### Level 1 — Conceptual / Abstract (the default for foundational docs)
- Describes **actors, sequence, roles, and intent**: who does what, in what order, why.
- Uses generic component names a learner already recognizes: "Certificate", "Public Key", "the server", "the symmetric key".
- Names an algorithm **only by its well-known example name** when doing so aids recognition (e.g. "RSA" as *the* textbook key-exchange example) — never its version, bit-length, or cipher-suite string.
- No version numbers, no bit-lengths, no CVE IDs, no exact config flags, no CLI commands.
- This is the target level for any section whose declared topic is "how does X work" / "what is the flow of Y".

### Level 2 — Technical
- Names the **specific mechanism or protocol family** when contrasting it against alternatives is the actual point (e.g. "RSA key exchange" vs. "Diffie-Hellman key exchange").
- Still avoids version pinning, exact bit-lengths, cipher-suite identifiers, and CLI-level specifics — unless the section's declared topic is precisely that comparison.
- This is the target level for a section whose declared topic is "which mechanisms exist and how do they differ", without yet being an implementation reference.

### Level 3 — Deep-Implementation
- Exact version numbers, bit-lengths, cipher-suite strings, config flags, CVE IDs, CLI commands, library-specific parameters.
- Used **only** inside a section whose declared topic scope explicitly *is* that layer of detail (e.g. a dedicated "TLS 1.2 vs 1.3 — Cipher Suite Comparison" document or section).
- Never leaks into a Level-1 flow explanation, even if the source material had it.

## 3. Scope-Matching Rule

**The depth of a section is governed by what its heading/TOC entry promises the reader — not by how much detail the source material happened to contain.**

Before rewriting anything, classify the document (or the specific section, if depth varies within one doc):
1. Is this a **foundational/base-knowledge** doc or section? → target Level 1.
2. Is this a **comparison-of-mechanisms** doc or section? → target Level 2, with Level 1 framing around it.
3. Is this a **specialist implementation reference** doc or section (its own title says so)? → Level 3 is allowed, but only within that section's boundary.

A single document may legitimately contain a Level-1 overview section followed by a Level-3 deep-dive section — as long as each section's own heading tells the reader which one it's entering. What is never allowed is Level-3 facts bleeding into a Level-1 section just because the source material mentioned them.

## 4. Decision Test Per Fact

Run every specific technical value pulled from research through this test, in order:

1. **Flow test** — Does this exact value change the conceptual sequence or the reader's understanding of *why* the flow works? If no → drop it or generalize it to the concept family.
2. **Scope test** — Is the current section's declared topic specifically about this layer of detail? If no → generalize.
3. **Practical-need test** — Would the reader need this exact value right now to configure or implement something? If no → drop it.

Keep the specific value only if it passes the scope test or the practical-need test. Otherwise, replace it with its concept-family name (see §8) or omit it entirely.

## 5. The Nuance-Insertion Pattern

Not every specific value is noise — some are worth a light mention because they **disambiguate behavior**, not because they're technically precise. The rule for inserting them tastefully:

- If a version or number changes which *flow* applies (e.g. "TLS 1.2" vs. "TLS 1.3" have genuinely different handshake sequences), a **brief inline mention** is fine — it orients the reader, it is not the headline.
- If a version or number is just incidental provenance (which exact cipher-suite string, which RFC section, which CVE) and does not change the flow being taught, it does not belong in a Level-1 narrative at all.
- Never let the specific value become the subject of the sentence in a Level-1 section. It is a light qualifier, not the point.
- Deeper comparative specifics (bit-lengths, cipher-suite IDs, exact config) belong in a side table, footnote, or a separate Level-2/Level-3 section — never folded into the main narrative flow.

## 6. Worked Example

**Raw research input (unusable as-is):** a dense sentence naming the exact standard, the exact algorithm, the exact bit-length, and citing its own source, all in one run-on clause, with no separation between flow and provenance.

**Level-1 rewrite (target for a foundational "how TLS establishes a shared secret" doc):**

> TLS 1.2 — a very common version — typically uses **RSA** for key exchange.
> 1. **TCP handshake:** done.
> 2. **Client Hello:** the client opens with "I want a TLS connection; here are the algorithms I support — key exchange via **RSA**, symmetric encryption via **AES**..."
> 3. **Server Hello:** the server replies "Agreed, RSA and AES. Here is my **Certificate** — it contains my **Public Key**."
> 4. **Client generates a secret:** the client validates the Certificate, generates a random "pre-master" secret, and encrypts it using the server's **Public Key**.
> 5. **Client sends the encrypted secret:** anyone intercepting it in transit cannot decrypt it.
> 6. **Server decrypts:** only the holder of the matching **Private Key** can recover the pre-master secret.
> 7. **Both sides derive the same symmetric key** from the shared pre-master secret; all further HTTP traffic is encrypted with it.

Notice what survives: the actors (Client, Server, Certificate, Public/Private Key), the sequence, and one light disambiguating mention ("TLS 1.2 — a very common version —") because it distinguishes this flow from TLS 1.3's. What was cut: the exact standard name, the exact bit-length, the citation — none of it changes the flow.

A **Level-2/3 companion section** ("TLS Key-Exchange Algorithms Compared" or "TLS 1.2 Cipher Suites") is where RSA vs. Diffie-Hellman trade-offs, key sizes, and cipher-suite strings belong.

## 7. Content Optimization Workflow

Run this pass on any deep-research dump before it becomes doc content:

1. **Extract the flow** — list the actors and the ordered steps, stripped of every specific value.
2. **List every specific technical value** found in the source (versions, bit-lengths, IDs, flags, citations).
3. **Classify the section's scope** per §3.
4. **Run the decision test (§4)** on each listed value; mark it *keep-as-is*, *generalize to family name*, or *drop*.
5. **Apply the nuance-insertion pattern (§5)** to anything that survived as a light disambiguator.
6. **Rewrite using the Problem → Solution narrative** (per `doc-structure-style` §7's storytelling flow): state the problem the mechanism solves, then how it solves it, at the target level.
7. **Route leftover Level-2/3 material** into its own clearly-scoped section or a separate doc, rather than deleting genuinely useful reference material.
8. Hand the result to `doc-structure-style` for skeleton/formatting compliance.

## 8. Conceptual-Family Naming Reference

When a specific implementation detail fails the decision test, generalize it to its concept family rather than dropping the idea entirely:

| Instead of (version-pinned) | Use (concept family) |
| :--- | :--- |
| A specific elliptic-curve parameter set / curve name | "the elliptic-curve family" |
| A specific message-queue product and version | "**Message Broker** architecture" |
| A specific LSM implementation's tuning parameters | "**Log-Structured Merge-tree** mechanism" |
| A specific cipher-suite string / key size | "authenticated symmetric block cipher" |
| A specific CVE ID or patch version | (omit — provenance, not flow) |

This keeps the document accurate and useful as a reference well after the specific version referenced in the original research is obsolete.

## 9. Final Checklist

- [ ] Every section's depth level was chosen from its **declared topic scope**, not from how detailed the source material was.
- [ ] Level-1 sections contain no version numbers, bit-lengths, CVE IDs, cipher-suite strings, or CLI flags.
- [ ] Any specific value that survived into a Level-1 section passed the flow test (§4) and follows the nuance-insertion pattern (§5) — it disambiguates, it isn't the headline.
- [ ] Level-2/3 material that was cut from the main flow was routed to its own clearly-scoped section/doc, not silently deleted if it had reference value.
- [ ] Specific implementation details that were generalized used a **concept-family name** (§8), not a vague placeholder.
- [ ] The rewrite follows a Problem → Solution narrative, not a re-ordering of the source's own structure.
- [ ] Formatting compliance (H1/TOC/Mermaid/code-block rules) was verified separately via `doc-structure-style` — this skill did not decide those.