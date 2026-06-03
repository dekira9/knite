# Architecture

## App layers

```mermaid
flowchart TB
  subgraph ui [UI - screens + components]
    Onboarding[screens/onboarding]
    Styles[screens/styles]
    RaglanCharts[screens/styles/raglan]
    Results[screens/styles/input/result]
  end

  subgraph nav [navigation/]
    AppNav[App.tsx Stack]
    Main[MainNavigator tabs]
    StylesNav[StylesNavigator]
    InputNav[InputNavigator]
    ResultNav[ResultNavigator]
    RaglanNav[RaglanNavigator]
  end

  subgraph state [state/]
    intro[introState MST]
    onboard[onboardingState MST]
  end

  subgraph backend [Supabase]
    Edge[calculate-raglan function]
    SQL[migrations/calculate_raglan_core.sql]
  end

  AppNav --> Onboarding
  AppNav --> Main
  Main --> StylesNav
  StylesNav --> InputNav
  StylesNav --> ResultNav
  StylesNav --> RaglanNav
  InputNav --> intro
  Results --> intro
  RaglanCharts --> intro
  intro --> Edge
  onboard --> ui
```

## Measurement wizard (InputNavigator)

| Route | File | Notes |
|-------|------|--------|
| Index | `screens/styles/input/index.tsx` | Redirects to Head |
| Head … Fit | `head.tsx`, `neck.tsx`, `chest.tsx`, … | Shared |
| RibbingWidth | `ribbing-width.tsx` | regular |
| RibbingWidthV | `ribbing-widthV.tsx` | v-neck |
| LineraglanWidth | `lineraglan-width.tsx` | regular |
| LineraglanV | `lineraglanV.tsx` | v-neck |
| DepthNeckV | `depthneckV.tsx` | v-neck only |

Progress bar: `components/IntroProgress.tsx` (step list depends on `introState.style`).

## Result flow

`ResultNavigator` → `result.tsx` (facade) →

- `RegularResult.tsx` — large; steps `Step1Ribbing` … `Step4SeparatingSleeves`
- `VNeckResult.tsx` — parallel `Step*V.tsx` and `ResultStepV`, `FrontV`

Shared math exports: `helpers.ts` (re-exported from `index.tsx`).

## Raglan charts

`RaglanNavigator` registers Ribbing / Back / Front / Sleeve. Each stack screen is a **facade** (`ribbing.tsx`, etc.) routing to:

| Facade | Regular impl | V-neck impl |
|--------|--------------|-------------|
| ribbing | `ribbingO.tsx` | `ribbingV.tsx` |
| back | `backO.tsx` | `backV.tsx` |
| front | `frontO.tsx` | `frontV.tsx` |
| sleeve | `sleeveO.tsx` | `sleeveV.tsx` |

## Large files (prefer surgical edits)

| File | ~lines | Role |
|------|--------|------|
| `utils/translations.ts` | 2300+ | All locales |
| `state/introState.ts` | 700+ | MST model + actions |
| `screens/styles/raglan/frontV.tsx` | 1200+ | V-neck front chart |
| `screens/styles/raglan/ribbingV.tsx` | 900+ | V-neck collar chart |
| `screens/styles/input/result/RegularResult.tsx` | 800+ | Regular result wizard |
| `screens/styles/input/result/helpers.ts` | 600+ | Increase-row algorithms |

## Path alias

`@/*` → project root (`tsconfig.json`).
