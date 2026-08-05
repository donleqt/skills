---
name: grill-fast
description: Run a relentless grilling interview on a plan or design, one probing question at a time, walking each branch of the decision tree to a shared understanding before any code is written.
disable-model-invocation: true
---

Interview the user relentlessly about every aspect of the plan, decision, or idea until you reach a shared understanding. Walk down each branch of the decision tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.

If a *fact* can be found by exploring the environment (filesystem, tools, etc.), look it up rather than asking the user. The *decisions*, though, belong to the user — put each one to them and wait for an answer.

If questions can be answered by common sense or technical best practices that balance with the context (no over complicated), decide instead of asking the user.

Do not act on the plan until the user confirms shared understanding has been reached.

---

Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) `grill-me`.
