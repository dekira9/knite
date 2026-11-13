# Growth plan (store research, 2026-11-14)

Why the app gets almost no downloads, and what we decided to do about it. Numbers are from the live listings and public App Store search on 2026-11-13.

## Findings

- **State:** iOS 1.0.1 released June 2026, Play 1.0.5. Zero ratings and reviews in both stores. Free, no monetization, no analytics SDK.
- **Download numbers are unknown.** The App Store Connect key gets 403 on analytics; sales reports need a vendor number and a key with the Sales or Admin role.
- **Listing is `en-US` only**, while the app ships 17 interface languages. We do not appear for "реглан" (RU, 3 results), "расчет реглана" (RU, 1 result) or "raglan stricken" (DE, 4 results).
- **We rank #1 for "raglan" (US), but nobody searches it**: the rest of that result page is ragdoll games. We are #3 for "top down sweater" and outside the top 25 for "knitting", "knitting calculator", "sweater calculator".
- **Name and keywords waste space.** "Raglan Planner" uses 14 of 30 characters and has no "knitting", "sweater" or "calculator". Keywords repeat "raglan" and "planner" from the name.
- **Calculators are a tiny store niche for everyone:**

| Kind | Example | Ratings |
|------|---------|---------|
| Knitting calculators | Cast Along | 55 (others 0–10) |
| Closest analog, in store since 2016 | KnitsThatFit Sweaters | 126 |
| Row counters | My Row Counter | ~4 000 |
| Companions (patterns + counter) | Loopsy, YarnPal | 17 000–35 000 |

- **Play listing** has 4 phone screenshots; neither store has a preview video.

## Conclusions

- Store search alone will not carry a raglan calculator: knitters look for the calculation on Google, YouTube, Pinterest and in knitting communities.
- Daily-use apps (row counters) get the search traffic; a one-off calculation does not.
- We cannot beat the leaders for "row counter" in the English store. The realistic openings are local stores with weak competition, long-tail queries ("sweater calculator", "расчёт реглана"), and the one thing counters lack: a counter that knows the sweater plan and says what to do in each row.
- Expectation: units to tens of installs per day, not hundreds. About $2 000 in the first year from search alone is unlikely (our guess: under 50%); it needs a channel outside the store (the author's social accounts, knitting bloggers).

## Plan

Each stage is a gate: continue only if the previous one moved installs.

| # | Stage | Scope | Gate |
|---|-------|-------|------|
| 0 | **Listings first** | New name with search words, subtitle, keywords, descriptions in all 17 languages via `tools/store` | Wait 3–4 weeks, compare installs |
| 1 | Simple row counter | Counter project without a calculation: big +1, undo, row target, note, list. New store under its own AsyncStorage key; ~8 files, 600–700 lines | — |
| 2 | New home screen | Opens on "my counters and sweaters" with a "calculate a sweater" button. Routes are added, not renamed | — |
| 3 | Analytics + rating prompt | Install and funnel events, ask for a rating after N rows. Two native dependencies, needs a new build | Installs still at units per day after 1–2 months: stop |
| 4 | "Knit by plan" mode | One screen for the whole sweater: big button, per-row hint, moves between pieces, screen stays awake. Needs per-row stitch logic extracted from the 8 chart screens (regular + v-neck) | Only if stages 1–3 brought installs |
| 5 | Subscription | Counter free; sweater calculation and knit-by-plan paid. Paywall + store products | Only with steady installs |

Already in the app and reusable for stage 4: per-chart current row, previous/next, "Stop" with the saved row (`screens/styles/raglan/RaglanChartRowToolbar.tsx`, `useRaglanChartState.ts`), saved projects, haptics.

## Open decisions

- New store name (for example "Knit Counter & Sweater Planner"; the name limit is 30 characters).
- Analytics provider (Amplitude was the original idea).
- An App Store Connect key with the Sales or Admin role plus the vendor number, so real install numbers can be read.
