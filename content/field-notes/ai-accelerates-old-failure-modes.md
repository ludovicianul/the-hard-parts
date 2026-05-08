---
title: AI Accelerates Old Failure Modes
slug: ai-accelerates-old-failure-modes
date: 2026-05-08
summary: AI did not invent most of the problems teams are now finding in their delivery process. It made them cheaper to start. The old failure modes have better tooling.
references:
  - code: FM
    slug: autocomplete-architecture
  - code: FM
    slug: synthetic-velocity
  - code: FM
    slug: benchmark-mirage
  - code: FM
    slug: prompt-ops-chaos
  - code: FM
    slug: context-window-hoarding
  - code: FM
    slug: human-in-the-loop-decay
  - code: FM
    slug: test-theater
  - code: FM
    slug: friendly-rewrite
  - code: FM
    slug: ownership-drift
  - code: RF
    slug: ai-generated-artifacts-are-trusted-more-than-source-material
  - code: RF
    slug: benchmarks-are-discussed-more-than-real-user-outcomes
  - code: TD
    slug: human-in-the-loop-vs-full-automation
  - code: TD
    slug: synthetic-evaluation-vs-real-world-evaluation
  - code: EP
    slug: upgrade-code-review-for-ai-assisted-work
---

AI did not invent most of the problems teams are now finding in their delivery process. It made them cheaper to start. That is the awkward bit.

A lot of teams are talking about AI-assisted development as if the main question is whether it makes engineers faster. And yes, sometimes it does. You can scaffold code faster. You can summarize meetings faster. You can generate tests faster. You can turn a vague product sentence into something that looks like a plan faster. But software teams already had a problem with mistaking visible motion for durable progress, and now the motion is cheaper. The old failure modes have better tooling.

That does not make AI bad. I use it. You probably use it. Most serious software teams will use it, because the productivity upside is real. Boilerplate generation, refactoring assistance, first drafts, API examples, migration scripts, documentation cleanup, test scaffolding, design alternatives — these are useful things. The interesting question is what happens when AI makes the weak parts of your engineering system move faster than the strong parts, because that is where things get weird.

## The happy path is very convincing

The first demo is always good. Someone opens an editor, describes a feature, gets a working shape back, fixes a few imports, and runs the tests. The code compiles. The endpoint responds. The component renders. The README is updated. The PR description is better than most human PR descriptions. Everyone relaxes a little.

This is understandable. A lot of engineering work is tedious, and AI is genuinely good at removing some of the drag: boilerplate, examples, transformations, naming options, migration scripts, test scaffolds, documentation cleanup. These are not fake wins.

The trap is that the same output contains two very different things: implementation detail and embedded judgment. The implementation detail is often useful. The embedded judgment is where the bill arrives.

A generated service class may contain a transaction boundary, an error-handling policy, a retry assumption, a naming convention, a data ownership assumption, a dependency direction, a testing seam, a security posture, and a quiet little opinion about where the business logic lives. The PR still says "AI helped scaffold this," but a bunch of decisions landed. Nobody remembers making them.

## Autocomplete architecture is architecture without witnesses

Teams have always copied patterns they did not fully understand. They copied from frameworks. They copied from Stack Overflow. They copied from a previous company. They copied from the loudest senior engineer. They copied from the first service in the repo, even if that service was built under completely different constraints.

AI changes the speed and confidence of the copying. Before, copying at least had friction. You had to search, read, adapt, paste, repair, and occasionally think. Now the pattern arrives pre-shaped. It uses the right terminology. It looks modern. It writes tests for itself. It explains itself in confident prose if you ask nicely.

This is how autocomplete architecture starts. Not with a reckless team, but with a reasonable team trying to move faster. One generated feature lands and the structure looks fine. Another engineer asks the model to follow the same style. A third engineer asks for something similar but gets a slightly different abstraction. The repo now contains three interpretations of the same architectural idea, each locally plausible, none deliberately chosen.

At first this looks like momentum. Later it looks like coupling. Later still, it looks like fear. People avoid changing structural code because nobody knows whether the shape is load-bearing, accidental, generated, cargo-culted, or genuinely important. And when a new joiner asks why the system is shaped this way, the honest answer is uncomfortable: "Because the AI generated it and it worked."

That is not an architecture decision. That is an artifact with authority.

## Spec-driven development helps, but only if the spec is real

This is where spec-driven development becomes important. A good specification gives AI something better than vibes to work against. It can turn generation from "please build what I mean" into "produce an implementation that satisfies this contract." That matters.

Specs help most where the desired behavior can be made explicit: API contracts, validation rules, data formats, state transitions, acceptance criteria, permission boundaries, edge cases, observable behavior, compatibility expectations, and invariants that must not be broken.

When those things are clear, AI becomes much more useful. The model has less room to invent intent. The feedback loop has something concrete to check. Tests can be derived from the same source of truth. Reviews can focus less on "what was this supposed to do?" and more on "does this implementation preserve the contract, the design, and the operational expectations?" That is a real improvement.

But spec-driven development does not remove the need for engineering judgment. It moves some of the judgment earlier. Someone still has to decide what the spec says. Someone still has to notice what the spec forgot. Someone still has to decide whether the generated design is appropriate, not merely whether it satisfies the visible contract. Someone still has to understand how the implementation behaves when the spec is incomplete, ambiguous, stale, or locally correct but globally harmful.

This is the part that gets missed when people talk about specs as if they are a magic containment field around generated code. A weak spec gives you confident automation around weak understanding. A strong spec gives you leverage. Those are very different things.

The useful promise of spec-driven development is not that engineers can stop understanding code. It is that engineers can spend more of their attention on the parts where understanding matters most: boundaries, behavior, invariants, failure cases, and design consequences. That is a good trade. It is not an escape hatch from comprehension.

## Synthetic velocity feels great until you ask what actually moved

AI makes output volume go up: more code, more tests, more tickets updated, more summaries, more branches, more prototypes, more design alternatives, more architecture diagrams, more meeting notes, more everything. That is useful if the bottleneck was output production.

But a lot of teams are bottlenecked elsewhere. They are bottlenecked on understanding, sequencing, integration, ownership, decision quality, review attention, and the ability to retire old complexity after introducing new complexity. AI does not automatically improve those. Sometimes it consumes them.

You get more PRs than the team can review properly. More generated tests than anyone has read. More documentation than anyone can verify. More suggested designs than the architecture group can evaluate. More tickets in motion than the delivery system can finish. The dashboard improves. The system does not.

This is the old velocity problem with a better printer. Teams have always liked measures that make movement visible: story points, ticket counts, deployment counts, coverage percentages, burn-up charts, throughput dashboards. AI gives those systems more material to count. It can create the appearance of engineering acceleration while quietly shifting the bottleneck to judgment, and judgment is harder to dashboard.

## The review step becomes the pressure point

If AI generates more work, someone still has to understand the work. This is the part that gets hand-waved.

People say AI-assisted development is fine because the human remains in the loop. The engineer reviews the output. The team reviews the PR. The reviewer checks the behavior. The system is still accountable to people. Yes. But let's walk through what that means.

A developer asks AI to produce a change. The change is larger than they would have written manually because generation is cheap. The tests are generated too. The explanation is clear. The PR is polished. The reviewer is busy. The team has a delivery date. The change looks sensible. CI is green.

What exactly is the reviewer reviewing? The behavior? The architecture? The generated assumptions? The tests? The absence of missing cases? The places where the model produced a correct-looking answer to the wrong problem? The places where the generated code followed the local pattern even though the local pattern is the thing that should have been challenged?

This is where human-in-the-loop quietly becomes human-near-the-loop, then human-after-the-loop, then human-approves-the-loop. Not because people are careless, but because the work arrives faster than real review capacity. Rubber-stamp review is not a new failure mode. AI just makes it easier to overwhelm the stamp.

## A strong feedback loop is not the same as understanding

There is a growing argument that engineers may not need to read much of the generated code if the feedback loop is strong enough. The shape of the argument is understandable.

If the tests are good, the types are strong, the linter is strict, the contracts are executable, the observability is useful, the deployment pipeline is safe, and rollback is fast, then maybe the exact implementation matters less. Maybe the engineer can stay at the level of intent, prompts, specs, and feedback.

There is truth in this. A strong feedback loop absolutely changes the economics of development. It catches mistakes earlier. It makes experimentation safer. It reduces the cost of being wrong. It allows AI to be used more aggressively in low-risk areas. In some cases, it is perfectly reasonable to care more about behavior than about every line of generated implementation.

But this has a shelf life. Over the long run, a team that does not understand its own output becomes dependent on the feedback loop being complete, and feedback loops are never complete.

Tests encode known expectations. Types encode certain classes of constraints. Linters encode style and some correctness rules. Contracts encode boundary behavior. Monitoring shows what you thought to observe. Production shows what users actually do, but late. Rollback helps after damage has started.

None of these fully explain whether the design is becoming harder to change, whether the abstraction is wrong, whether the domain model is drifting, whether the security assumption is naive, whether the data ownership boundary is being crossed, whether the system is becoming expensive to operate, or whether the next change will be painful because this change made the wrong thing easy.

You can pass the feedback loop and still make the system worse. That has always been true. AI just gives you more ways to do it quickly.

So yes, invest heavily in feedback loops. Make specs executable. Make tests meaningful. Make CI fast. Make review smaller. Make rollback real. Make production observable. Use AI in that environment, not outside it. But do not confuse a strong feedback loop with permission to stop understanding the system.

The sustainable version is not "engineers only prompt." The sustainable version is "engineers use AI to produce options faster, then remain accountable for the behavior, structure, and consequences of what enters the system." That accountability requires comprehension. Maybe not of every character. Definitely of the output.

## Summaries are not sources

AI is very good at producing text that feels like knowledge: meeting summaries, incident summaries, architecture summaries, customer feedback summaries, codebase summaries, decision summaries, research summaries, Slack summaries, transcript summaries. This is useful. It is also dangerous in a very specific way.

A summary is a compression artifact. It is an interpretation of the source. Sometimes it is a good interpretation. Sometimes it silently removes the only detail that mattered.

Teams already had source discipline problems before AI. Decisions lived in chat. Requirements lived in someone's memory. Incident detail lived in a recording nobody watched. Architecture rationale lived in a meeting that half the team missed. The system of record was already blurry.

AI makes the blur more readable, and that is worse than it sounds, because once the summary is readable, people stop opening the source.

"The recap said we agreed."

"The AI summary said the root cause was X."

"The generated analysis says this API is unused."

"The assistant said the migration is mostly complete."

Maybe. But if the source matters, the summary is only an entry point. It is not evidence.

This becomes especially risky when summaries start feeding other summaries. A transcript becomes a recap. The recap becomes a planning note. The planning note becomes a decision record. The decision record becomes onboarding material. Six weeks later the team is arguing from a polished distortion and nobody remembers where the original claim came from.

This is knowledge drift with better grammar.

## Benchmarks are the new coverage percentage

Software teams love numbers that make quality feel objective. Test coverage used to do this job. It still does. A high coverage number feels like safety, even when the tests mostly assert mocks, snapshots, and implementation details.

AI systems get benchmark scores, and the failure mode is familiar. A benchmark becomes a proxy for quality. Then it becomes a target. Then the team improves the target. Then everyone forgets what the target was supposed to represent.

You can have a model or prompt that performs well on a synthetic eval and still fails at the real user task. You can have a retrieval system that looks good on curated questions and still gives unsupported answers when the source material is messy. You can have a support copilot that scores well in review and still teaches users the wrong workaround when the product state is ambiguous.

The benchmark is useful until benchmark optimism crosses a trust boundary. That is how teams end up automating workflows before they understand the consequence of wrong automation. The system looks capable on the happy path. The demo is fluent. The internal eval is improving. The chart goes up and to the right. Then production supplies the cases that the benchmark did not know how to ask.

## Prompt ops is configuration management, but with vibes

Prompts look softer than code. That is part of the problem.

A team would usually be cautious about changing payment logic, authorization rules, retry policy, routing behavior, feature flags, or production configuration without versioning and review. But the hidden instruction that controls how an AI feature behaves might live in a database field, a dashboard, a low-code workflow, a vendor console, a YAML file, or the private memory of the person who last fixed the demo.

Then the model changes. The prompt changes. The retrieval context changes. The temperature changes. The guardrail changes. The tool description changes. The system behavior changes. Nobody can reproduce last Tuesday.

Again, this is not entirely new. Teams have always had configuration drift, environment drift, undocumented operational tweaks, and "just change it in the console" culture. AI makes the drift semantic. The system still runs, but its behavior moved. And because the behavior is expressed in natural language, people underestimate how much engineering discipline it needs.

A prompt that materially changes production behavior is not a note. It is part of the system. Treating it as anything less is how you get prompt ops chaos.

## Context windows make hoarding look responsible

There is another very modern-looking version of an old habit: throwing more input at a problem because deciding what matters is hard.

Before AI, this looked like giant documents, overloaded meetings, massive Jira tickets, unread Confluence pages, and architecture decks with forty-seven backup slides. Now it looks like filling the context window.

Add the whole repo. Add the design doc. Add the API spec. Add the logs. Add the transcript. Add the previous incident. Add the coding standards. Add the customer feedback. Add the roadmap. Add ten examples. Add the old architecture decision record. Add the new one too, just in case.

This feels thorough. Sometimes it is. Often it is just avoidance.

The team has not decided what evidence matters, which constraints are binding, which examples are representative, or which source should win when sources disagree. So everything goes in, and the model now has more material and less clarity.

When the answer is wrong, debugging becomes a fog. Was the problem the prompt? The retrieval? The ranking? The stale source? The conflicting instruction? The model? The tool call? The example? The missing example? The fact that the source document was obsolete but still indexed?

Context is not understanding. A larger context window mostly gives you a larger place to hide weak source discipline.

## AI does not remove ownership problems

A surprising amount of AI adoption discussion is really ownership discussion in disguise. Who owns generated code? Who owns generated tests? Who owns the prompt? Who owns the eval set? Who owns the source corpus? Who owns model behavior after deployment? Who owns rollback when the AI feature is wrong? Who owns the decision to move from copilot to automation? Who owns the support burden when the automation creates confident mistakes at scale?

These are operational questions. If the answer is "the team," that might be fine, but only if the team has actual time, authority, review practice, monitoring, and incentives to own the thing. Otherwise AI becomes another way to create orphaned responsibility.

The output has an author. The consequences have an owner. They are not always the same person.

## So what should teams do?

The boring answer is still the best one: slow down the parts where judgment enters the system.

Not all of it. Not the boilerplate. Not the mechanical transformations. Not every tiny generated helper or test fixture. That would be theater, and theater is already one of the problems. But when AI output changes structure, authority, evidence, behavior, or ownership, treat that as engineering work.

A useful rule is this:

> AI may accelerate production. It must not bypass comprehension.

That sounds obvious. So do most useful rules before they are violated.

In practice, it means generated code that introduces a new abstraction needs design review, not just correctness review. Generated tests need to be read for what they fail to protect, not admired because the number went up. Generated summaries need links to source material when the claim matters. AI evaluation needs real tasks, not only synthetic benchmarks. Human approval steps need to preserve real judgment, or they should not be used as evidence of safety.

It also means prompts, model settings, retrieval rules, and tool definitions need versioning when they affect production behavior. Context should be curated, not hoarded. Automation should expand only when consequence is bounded, monitoring is strong, and rollback is real. Specs should be treated as living engineering artifacts, not decorative prompts.

None of this is glamorous. It is mostly engineering discipline applied to a new source of speed.

## The failure modes were already there

That is the point.

AI can generate more tickets, better descriptions, cleaner status updates, and more convincing progress narratives. That gives Ticket Theater new material.

AI can make one AI-fluent engineer the gateway through which all important automation decisions pass. That gives the Hero Trap a new costume.

AI can produce polished abstractions faster than the team can ask whether they need them. That gives Abstraction Addiction a faster path into the codebase.

AI can supply new metrics that feel even more objective than the old ones. That gives Metric Myopia fresh dashboards.

AI can make a rewrite feel cheaper to start and therefore easier to justify before anyone has planned the landing zone. That gives the Friendly Rewrite a smoother sales pitch.

AI can generate a lot of tests that mostly prove the generated code behaves the way the generated code behaves. That gives Test Theater a productivity story.

AI can produce systems whose operational responsibility is less clear than their implementation path. That gives Ownership Drift more places to hide.

The names are old. The acceleration is new.

## The useful question

The useful question is not only whether AI makes engineers faster. For many tasks, yes, it does.

The useful question is: **which failure modes does AI accelerate in your team?**

Not in theory. In your repo. Your review process. Your incident reviews. Your architecture decisions. Your documentation habits. Your delivery metrics. Your approval workflows. Your source discipline.

Because if a team already has weak review, AI will not magically create strong review. If a team already confuses activity with progress, AI will produce more activity. If a team already avoids hard ownership conversations, AI will give those conversations more places to hide. If a team already trusts dashboards over delivery reality, AI will make the dashboards look healthier. If a team already struggles to keep source material clean, AI will summarize the mess.

This is why the AI adoption conversation needs fewer slogans and more failure-mode inspection. Not "AI-first." Not "ban AI." Not "move fast." Not "govern everything."

Just this: find the old patterns, assume the new tooling will speed them up, put judgment back where the consequences are, and then use AI for what it is actually good at.

That is less exciting than the demo. It is also where the engineering starts.
