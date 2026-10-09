# Knite — Raglan knitting planner

Expo React Native app for raglan sweater measurements, step-by-step results, and knitting charts (regular and v-neck).

## Setup

```bash
yarn install
cp .env.example .env   # if present; set Supabase keys (see SUPABASE_SETUP.md)
yarn start
```

## Docs for contributors & AI

- [AGENTS.md](./AGENTS.md) — project map, conventions, what to avoid
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — navigation and module diagram
- [docs/TEST_PLAN.md](./docs/TEST_PLAN.md) — manual regression checklist
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) — edge function for raglan calculations

## Scripts

| Command | Description |
|---------|-------------|
| `yarn start` | Expo dev server |
| `yarn ios` / `yarn android` | Native run |
| `yarn test` | Jest |
| `yarn lint` | ESLint |

## Stack

React Navigation · MobX / MST (`state/`) · i18n-js · Supabase edge function `calculate-raglan`
