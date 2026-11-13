# Knite (Raglan Planner) — agent guide

Expo React Native app: raglan sweater measurements → step-by-step result → chart screens. React Navigation stacks in `navigation/` (**not** Expo Router).

Find files through the docs, not by browsing: `docs/TASK_ROUTER.md` (task → files), `docs/HOTSPOTS.md` (line-level edit map), `docs/SYMBOLS.md` (grep index), `docs/ARCHITECTURE.md` (flow), `docs/RAGLAN_GLOSSARY.md` (legacy field names: **grep it, never read `introState.ts` to guess a field**).

## Quick map

| Area | Path |
|------|------|
| Navigators | `navigation/*.tsx` (App → Onboarding or Main → StylesNavigator → Input / Result / Raglan) |
| Screens | `screens/styles/` (input wizard, `input/result/`, `raglan/` charts), `screens/onboarding/` |
| State | `state/introState.ts` (MST, persisted), `state/onboardingState.ts` (language, units), typed access `state/raglanSelectors.ts` |
| Raglan math | `utils/raglan/` (shared with Supabase edge `calculate-raglan`; device calls it via `utils/calculateRaglanCoreRemote.ts`); UI row helpers `screens/styles/input/result/helpers.ts` |
| i18n | `utils/i18n/strings/` — edit only through `yarn i18n get|add|set` |
| Store listings | `tools/store/` — Python CLI for App Store Connect (`asm.py`) and Google Play (`play.py`); see its `README.md`. Keys in `~/bare/.secrets/store/` (shared, outside the repo) |

## Style variants `regular` / `v-neck`

`RaglanStyleId` (`constants/samplePresets.ts`), stored on `introState.style`. Facades pick the implementation: `input/result/result.tsx` → `RegularResult` | `VNeckResult`; `raglan/{ribbing,front,back,sleeve}.tsx` → `*O.tsx` | `*V.tsx`. Big screens keep their pieces in a sibling `<name>Parts/` folder: open the piece you need, not the whole set. Twins (`Sgor` / `SgorV`, …) are listed in `RAGLAN_VARIANT_FIELDS`; shared logic changes in both variants.

## Invariants (never change without a migration)

- **AsyncStorage keys:** `introState`, `introSavedProjects`, `onboardingState`. `introState` fields = `INTRO_STATE_PERSISTED_KEYS` (`state/introStatePersistedKeys.ts`); renames go through `state/introStateMigration.ts`.
- **Paired fields** change together (`RAGLAN_VARIANT_FIELDS`).
- **Raglan math contract:** `RaglanOutput` (`utils/raglan/types.ts`) and `utils/raglan/__tests__/goldenSample.json` change only on purpose, with the edge function redeployed.
- **Style ids** `'regular' | 'v-neck'` are persisted in saved projects.
- **New i18n keys:** every locale in `SUPPORTED_LANGUAGES`; at least real `en` + `ru` (the script copies `en` into the rest).

## Checks (before you say "done")

- `yarn verify` (types ratchet, ESLint, Jest, ~20 s) must be green; after calculation changes also `yarn test:raglan`; after nav/state/calc changes see `docs/TEST_PLAN.md`.
- Fast loop: `yarn typecheck [paths]` (`--known` shows frozen errors), `npx eslint <files>`, `npx jest <path>`. Never raw `npx tsc` (~475 baseline errors).
- Old errors are frozen in `tsc-baseline.json` / `eslint-suppressions.json`; after fixing some run `yarn typecheck:update` / `yarn lint:prune`. Never edit them by hand.
- No `any`, `@ts-ignore`, `eslint-disable` to get green. Keep ESLint slim (no Expo preset). AsyncStorage is mocked in `jest.setup.js`.

## Reading budget

- Folder rules load on their own (nested `CLAUDE.md` imports the matching `.cursor/rules/*.mdc`; edit the `.mdc`).
- Heavy paths are blocked in `.claude/settings.json`. Root leftovers `calculateIncreaseRows .js`, `calculateIncreaseRows.obf.js`, `ScV.jpg`, `unnamed.png` are unused.
- Files still over ~400 lines: open by section (grep, then `sed -n`): `state/introState.ts`, `screens/styles/input/result/RegularResultSummary.tsx`, `utils/i18n/strings/**` (use `yarn i18n` instead).
- Without an explicit request: no edits to `ios/`, `android/`, EAS config, bulk `assets/`; no merging `*O`/`*V` screens or collapsing `introState` fields.

## Keeping the map current

A change to invariants, navigation, persisted state or file layout updates this file, the matching `.cursor/rules/*.mdc` and `docs/TASK_ROUTER.md` / `docs/HOTSPOTS.md` in the same change. Docs in English; delete stale docs.

## Commands

`yarn start` · `yarn ios` / `yarn android` · `yarn verify` · `yarn typecheck [paths]` · `yarn test` · `yarn test:raglan` · `yarn lint` · `yarn i18n get|add|set`
