---
title: AI Accelerates Old Failure Modes
slug: ai-accelerates-old-failure-modes
date: 2026-05-13
summary: AI did not invent the ordinary gaps in software delivery like incomplete specifications, rushed reviews unclear ownership, or architecture that is harder to explain than we would like. It made those gaps easier to carry forward into working code. This is why engineering judgment matters more than ever.
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

# Introduction

There is a sentence I keep hearing in different forms: “AI is making engineers dramatically faster.”

I have mixed feelings about it. Because yes, I know it is true from experience. I am more productive than I have ever been. But I do not necessarily see that as universally good news. It is not bad news either. It is mixed news.

Because if you spend enough time away from LinkedIn screenshots, keynote demos, and articles where AI writes the whole application while the developer sips espresso and nods wisely, the picture becomes a bit less magical.

AI is useful, really useful. I use it and I think every software engineer should use it. Honestly, if you have not seriously tried it yet, you should probably reconsider how you are approaching your software career. This is not a tiny tooling shift. It is already changing the way software is written, reviewed, documented, tested, and discussed.

But there is a difference between moving faster and making durable progress.

AI did not invent most of the problems teams are now discovering in their delivery process. It made them cheaper to start. It made weak specifications cheaper to turn into code. It made vague product thinking cheaper to turn into tickets. It made half-understood architecture cheaper to turn into scaffolding. It made unreviewed assumptions cheaper to merge. It made impressive demos cheaper to produce.

It made motion cheaper. And software teams were already good at looking busy, keeping velocity steady, and still not making as much real progress as the charts suggested.

## The first version is always convincing

Building the first version of something with AI feels great. You open your editor, describe the feature, and AI creates the controller, service, DTOs, tests, maybe a migration, maybe a README update. You fix two imports. You rename one method. You run the tests. Green.

And this is genuinely useful. A lot of engineering work contains annoying friction: boilerplate, examples, transformations, repetitive tests, documentation cleanup, migration scripts, API clients, refactoring support, and first drafts of things you were going to write anyway. AI is good at reducing that drag.

If I need a first version of a small utility, a test scaffold, a few options for an API shape, or a migration script that I will carefully inspect, I would rather use AI than pretend typing everything by hand is some noble craft. Typing is not the job. Thinking is the job.

And that is exactly where the problem starts, because generated code does not only contain code. It contains decisions.

A generated service class might quietly choose where the transaction boundary lives. It might decide how errors are represented. It might assume retries are safe. It might place business logic in the wrong layer. It might invent a naming convention. It might introduce a dependency direction that looks harmless today and painful in six months.

The PR says “AI helped scaffold this,” but a lot of design decisions just landed. Nobody remembers making them.

## The old copy-paste problem got a better suit

Teams have always copied patterns they did not fully understand. From Stack Overflow. From framework examples. From another project. From a previous company. From the oldest service in the repo, which everyone treats as “the standard” even though it was written during a release panic in 2019.

AI changes the speed and confidence of that copying. Before, copying had friction. You had to search, read, paste, adapt, repair, and maybe, accidentally, understand something. Now the pattern arrives polished. It uses the right words, creates tests, explains itself, and sounds reasonable. It sounds like someone senior wrote it after a coffee and a good night’s sleep.

This is how autocomplete architecture begins.

One generated feature lands and looks fine. Another engineer asks AI to follow the same style. A third asks for something similar but gets a slightly different abstraction. A fourth asks the model to “make it cleaner,” which usually means “add one more layer.” Now the codebase contains four interpretations of the same idea. Each one is locally plausible. None of them was deliberately chosen.

At first, this looks like momentum. Later, it looks like coupling. Later still, it looks like fear.

People avoid changing the structure because nobody knows which parts are intentional, accidental, generated, cargo-culted, or load-bearing. A new joiner asks why the system is shaped this way, and the honest answer is uncomfortable: “Because the AI generated it and it worked.”

That is not an architecture decision. It is an accident that started to look official.

## AI is excellent for speed. That does not mean it belongs directly in scale.

I like the distinction between two modes of engineering.

There is the mode where the business is trying to reduce uncertainty. Will users click this? Will this workflow make sense? Will this client care? Can we prove the idea before spending three months building the “proper” thing?

This mode wants speed. It wants learning. It wants something real enough to react to. AI is fantastic here.

Use it for prototypes, MVPs, internal tools, throwaway demos, design alternatives, fake doors, admin screens, data exploration, quick integrations, and the first ugly version that teaches you whether the idea deserves a second version. This is good use of AI.

Then there is the other mode: the mode where customers are already using the system. Money is moving. Data matters. Auditability matters. Security matters. Incidents matter. Future change matters. The system has to remain understandable, operable, debuggable, teachable, and boring in all the right places.

This mode does not only want speed. It wants stability. It wants responsibility. It wants the system to still make sense when the original author is on holiday, the model has changed, the prompt is gone, the ticket is closed, and production is doing that very creative thing production does.

AI can help here too, but it has to be handled differently.

The dangerous move is to treat “AI helped us get the prototype working” as evidence that “AI can safely push the production system forward at the same speed.” Sometimes it can. Often it cannot. Not without stronger specifications, tighter review, better tests, clearer ownership, and more discipline around what gets promoted from experiment to durable system.

The prototype is allowed to be messy. The product is not. Or at least it should not be. One thing I notice is that AI has made us more tolerant of rough edges, even in systems where we used to expect real engineering rigor.

## Spec-driven development helps, but only if the spec is real

This is where people often say: “The solution is spec-driven development.”

And yes, it helps a lot. A good spec gives AI something better than vibes. It changes the request from “build what I mean” to “build something that satisfies this contract.” That is a big improvement.

Specs help when the desired behavior can be made explicit: API contracts, validation rules, permission boundaries, data formats, state transitions, edge cases, compatibility requirements, invariants, and failure behavior. That kind of clarity makes AI much more useful. The model has less room to invent intent. Tests can be derived from the same source of truth. Reviews can focus less on “what was this supposed to do?” and more on “does this preserve the contract and the design?”

But a weak spec does not become strong because AI followed it confidently. That is the trap.

A vague spec plus AI gives you fast implementation of vague thinking. A stale spec plus AI gives you automation around old assumptions. A locally correct spec plus AI can still produce something globally harmful.

Someone still has to decide what the spec says. Someone still has to notice what the spec forgot. Someone still has to ask whether the generated design belongs in this system. Someone still has to understand what happens when the real world steps outside the examples.

Spec-driven development is not a magic containment field around generated code. It is a way of moving judgment earlier. That is useful, but it is not permission to stop thinking.

## Synthetic velocity feels amazing until you ask what actually moved

AI increases output: more code, more tests, more tickets, more summaries, more branches, more documentation, more diagrams, more design options, more prototypes, more pull requests, more everything.

This is useful if the bottleneck was output production. But in many teams, output production is not the real bottleneck. The bottleneck is understanding. Or sequencing. Or integration. Or review capacity. Or ownership. Or decision quality. Or the ability to remove old complexity after introducing new complexity.

AI does not automatically improve those things. Sometimes it puts more pressure on them.

You get more pull requests than the team can review properly. More generated tests than anyone has read. More documentation than anyone can verify. More “options” than anyone has time to evaluate. More tickets in progress than the delivery system can finish.

The dashboard improves. The system does not.

This is the old velocity problem with an AI label on it. Teams already liked counting things that were easy to count: story points, tickets closed, deployments, test coverage, cycle time, throughput, burn-up charts. AI gives those systems more material. It can make engineering look accelerated while quietly moving the bottleneck to judgment, and judgment is much harder to dashboard.

## Review becomes the pressure point

People say: “It’s fine. The human is still in the loop.”

Yes. Let’s talk about that loop.

A developer asks AI to produce a change. The change is larger than they would normally write because generation is cheap. The tests are generated too. The explanation is clean. The PR description is better than the usual human one. CI is green. The reviewer is busy. The delivery date is close. The change looks reasonable.

So what is the reviewer actually reviewing?

The behavior? The architecture? The assumptions? The tests? The missing tests? The security implications? The dependency direction? The data ownership boundary? The fact that the generated code followed an existing pattern that maybe should not exist anymore?

This is where “human in the loop” becomes “human near the loop,” then “human after the loop,” then “human approves the loop.” Not because people are lazy, but because real review is expensive, and AI can create review demand faster than teams can create review capacity.

Rubber-stamp review is not new. AI just gives the stamp more paper.

## “The tests passed” is not the same as “the system got better”

There is a tempting argument that engineers may not need to understand all generated code if the feedback loop is strong enough.

I understand the argument. If you have good tests, strong types, strict linters, executable contracts, useful observability, safe deployments, and fast rollback, maybe you can work more at the level of intent. Maybe you do not need to read every line with the same care you used to.

There is truth in that. A strong feedback loop changes the economics of development. It catches mistakes earlier. It makes experiments safer. It makes AI more useful. It reduces the cost of being wrong.

But feedback loops are never complete.

Tests encode known expectations. Types catch certain categories of mistakes. Linters catch style and some correctness issues. Contracts check boundary behavior. Monitoring shows what you thought to observe. Production tells you what users actually do, but late. Rollback helps after the problem has started.

None of this fully answers the harder questions. Is the abstraction wrong? Is the domain model drifting? Is this making the next change harder? Did we put logic in the wrong place? Are we crossing an ownership boundary? Did we make the system more expensive to operate? Did we make the wrong thing easy?

You can pass the feedback loop and still make the system worse. That was true before AI. AI just lets you do it faster.

So yes, invest in feedback loops. Please. Make tests meaningful. Make CI fast. Make contracts executable. Make rollback real. Make production observable. Use AI inside that environment, not instead of it.

## Summaries are not sources

AI is very good at producing text that feels like knowledge: meeting summaries, incident summaries, architecture summaries, research summaries, customer feedback summaries, codebase summaries, Slack summaries, decision summaries.

This is useful. It is also dangerous in a very specific way.

A summary is not a source. A summary is a compression artifact. It is someone’s — or something’s — interpretation of the source. Sometimes it is good. Sometimes it removes the one detail that mattered.

Teams already had source discipline problems before AI. Decisions lived in chat. Requirements lived in someone’s memory. Incident details lived in recordings nobody watched. Architecture rationale lived in a meeting that half the team missed. The system of record was already blurry.

AI makes the blur readable. That is worse than it sounds, because once the summary is readable, people stop opening the source.

“The recap said we agreed.”

“The AI summary said the root cause was X.”

“The assistant said this API is unused.”

“The generated migration analysis said this was safe.”

Maybe. But if the claim matters, the source matters. The summary can be the doorway. It cannot be the evidence.

This gets especially messy when summaries feed other summaries. A meeting transcript becomes a recap. The recap becomes a planning note. The planning note becomes a decision record. The decision record becomes onboarding material. Six weeks later, the team is arguing from a polished distortion and nobody knows where the original claim came from.

That is how knowledge drift gets easier to miss: the wording improves while the connection to the original source gets weaker.

## Prompt changes are production changes

Prompts look harmless. That is part of the problem.

A team would usually be careful when changing payment logic, authorization rules, routing behavior, retry policies, production configuration, or feature flags. But the instruction that controls an AI feature may live in a dashboard, a database row, a YAML file, a vendor console, a low-code workflow, or the private notes of the person who fixed the demo last Thursday.

Then the model changes. The prompt changes. The retrieval context changes. The temperature changes. The tool description changes. The guardrail changes. The system behavior changes. Nobody can reproduce what happened last week.

This is configuration drift, but semantic. The system still runs. The behavior moved. And because the behavior is written in natural language, people underestimate how much engineering discipline it needs.

A prompt that materially changes production behavior is not a note. It is part of the system. Version it. Review it. Test it. Own it.

## Context windows make hoarding look responsible

Another modern-looking problem is just an old habit wearing AI clothes.

Before AI, teams created giant documents, overloaded meetings, massive Jira tickets, unread Confluence pages, and architecture decks with forty-seven backup slides. Now we fill the context window.

Add the whole repo. Add the API spec. Add the design doc. Add the logs. Add the transcript. Add the incident review. Add the coding standards. Add the customer feedback. Add the roadmap. Add the old architecture decision record. Add the new one too, just in case.

This feels thorough. Sometimes it is. Often it is avoidance.

The team has not decided what matters. It has not decided which constraint wins. It has not decided which source is authoritative. It has not decided which examples are representative. It has not cleaned up obsolete material. So everything goes in.

Now the model has more context and less clarity.

When the answer is wrong, debugging becomes foggy. Was the issue the prompt? The retrieval? The ranking? The stale document? The conflicting instruction? The missing example? The old ADR that was still indexed? The model? The tool? The fact that nobody knew what the actual source of truth was?

Context is not understanding. A larger context window is often just a larger place to hide weak source discipline.

## AI does not remove ownership problems

A surprising amount of AI adoption discussion is really ownership discussion.

Who owns generated code? Who owns generated tests? Who owns the prompt? Who owns the eval set? Who owns the source corpus? Who owns model behavior after deployment? Who owns rollback? Who owns the support burden when automation makes confident mistakes at scale? Who decides when a copilot becomes automation? Who is accountable when the AI-generated thing works in the demo and fails in the system?

“The team owns it” can be a fine answer, but only if the team has time, authority, review practices, monitoring, and incentives to actually own it. Otherwise AI becomes another way to create orphaned responsibility.

The output has an author. The consequences have an owner. They are not always the same person. That gap is where many problems live.

## What happens when the weak parts move faster than the strong parts?

This is the question I keep coming back to.

Every delivery system has stronger parts and weaker parts. Maybe your team has strong engineers but weak specs. Maybe strong CI but weak review. Maybe strong product ideas but weak ownership. Maybe strong architecture discussions but poor documentation. Maybe strong delivery pressure but weak cleanup habits. Maybe strong prototypes but weak production hardening.

AI accelerates the whole system unevenly. It does not only make strong engineers stronger. It can also make weak specs more executable, weak review more overwhelmed, weak ownership more ambiguous, weak architecture more permanent, weak documentation more convincing, and weak delivery metrics more misleading.

That is the real risk.

Not “AI writes bad code.” Humans also write bad code. Enthusiastically. Every day.

The deeper risk is that AI makes it easier to move from unclear intent to committed artifact without enough judgment in between. That artifact may be code, a test, a plan, a summary, a decision, a migration, a support answer, or an architecture diagram.

The specific output changes. The underlying weakness usually does not.

## So what should teams do?

The simplest answer is still the best one: slow down the places where judgment enters the system.

Not everywhere. Not for every generated helper. Not for every test fixture. Not for every bit of boilerplate. That would only create the appearance of control, not the reality of it.

But when AI output changes structure, authority, behavior, evidence, or ownership, treat it as real engineering work.

Generated code that introduces a new abstraction needs design review, not just correctness review. Generated tests need to be read for what they protect and what they ignore. Generated summaries need links to source material when the claim matters. Generated plans need someone accountable for the sequencing. Prompts that affect production behavior need versioning and review. AI evals need real tasks, not only synthetic benchmarks. Context needs curation, not hoarding. Specs need to be living engineering artifacts, not decorative prompts.

And automation should expand only when consequence is bounded, monitoring is strong, and rollback is real.

A useful rule is:

> AI may accelerate production. It must not bypass comprehension.

It sounds obvious, but under delivery pressure, this is exactly the kind of rule teams quietly negotiate away.

## The failure modes were already there

That is the point.

AI can generate more tickets, better descriptions, cleaner updates, and more convincing progress narratives. That gives ticket theater more material.

AI can make one AI-fluent engineer the gateway for every important automation decision. That gives the hero trap a new costume.

AI can produce polished abstractions faster than the team can ask whether they need them. That gives abstraction addiction a faster path into the codebase.

AI can create metrics that feel objective. That gives metric myopia fresh dashboards.

AI can make rewrites feel cheaper to start. That gives the friendly rewrite a smoother sales pitch.

AI can generate tests that mostly prove the generated code behaves the way the generated code behaves. That gives test theater a productivity story.

AI can produce systems whose operational ownership is less clear than their implementation path. That gives ownership drift more places to hide.

None of these problems started with AI. AI just makes them easier to trigger and harder to notice early, because the output looks cleaner than it used to.

## The useful question

AI usage in engineering work is a given. The useful question is: “Which failure modes does AI accelerate in your team?”

Not in theory or based on what AI companies CEOs say. In your repo. Your review process. Your incident reviews. Your architecture decisions. Your documentation habits. Your delivery metrics. Your approval workflows. Your source discipline.

Because if a team already has weak review, AI will not magically create strong review. If a team already confuses activity with progress, AI will produce more activity. If a team already avoids ownership conversations, AI will give those conversations more places to hide. If a team already trusts dashboards over delivery reality, AI will make the dashboards look healthier. If a team already struggles to keep source material clean, AI will summarize the mess.

This is why AI adoption needs fewer slogans.

Not “AI-first.” Not “ban AI.” Not “move fast.” Not “govern everything.”

Something more practical: find the old patterns, assume the new tooling will speed them up, put judgment back where the consequences are, and then use AI for what it is actually good at.

Moving faster is useful. Understanding what you are moving toward while keeping things robust and consistent is still the harder part.
