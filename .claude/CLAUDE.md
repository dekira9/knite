# Claude Code only

(If you are a Cursor model running a delegated task, ignore this file and follow the task you were given.)

Project rules:

@../AGENTS.md

Delegation and screenshot rules are global (`~/.claude/CLAUDE.md`, `~/.claude/skills/delegate`). Here only the project bits.

## Delegate: project specifics

- Invariants (do it yourself): AsyncStorage keys and `INTRO_STATE_PERSISTED_KEYS`, paired regular / v-neck fields, route names, the `calculate-raglan` input/output contract and golden sample (`AGENTS.md` § Invariants).
- Grok, not Composer: user-facing copy (`utils/i18n/strings/`), knitting instructions wording, UI design and layout.
- Extra Do-not lines for task files:
  - Never edit `ios/` or `android/`. Paired fields: a change to a regular field (`Sgor`) also goes to its v-neck twin (`SgorV`); see `docs/RAGLAN_GLOSSARY.md`.
  - i18n: a new key goes to every locale in `utils/i18n/supportedLanguages.ts` and to `utils/i18n/translationKeys.ts`.
- Scoped check example: `npx jest state/__tests__/raglanSelectors.test.ts && yarn typecheck state`. Full check: `yarn verify` (+ `yarn test:raglan` after calculation changes).
- Commit only when the user asked for it.
- Visual checks: prefer `yarn test:raglan` and other text checks over screenshots.
