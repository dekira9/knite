# Manual test plan

Use after changes to navigation, `introState`, calculations, or style facades.

## Onboarding

- [ ] Fresh install: Language → Measurement → Main app
- [ ] Language change persists (Settings or onboarding)
- [ ] Metric / imperial persists

## Style selection

- [ ] Choose **regular** on Styles home — correct label, input progress steps (no DepthNeckV)
- [ ] Choose **v-neck** — extra steps RibbingWidthV, LineraglanV, DepthNeckV

## Regular flow

- [ ] Complete input wizard through LineraglanWidth
- [ ] Calculate → Result steps 1–4 render without crash
- [ ] Open Raglan charts: Ribbing, Back, Front, Sleeve
- [ ] Back navigation through stacks

## V-neck flow

- [ ] Same as regular with v-neck-specific screens and `*V` result steps
- [ ] Charts use V implementations (facades route correctly)

## Persistence

- [ ] Kill app and relaunch — onboarding skip, language/units kept
- [ ] Save project (if exposed in UI) — reload restores measurements

## Supabase (when configured)

- [ ] `.env` with `EXPO_PUBLIC_SUPABASE_URL` and anon key
- [ ] Result sync populates computed fields (no silent empty state)

## Settings

- [ ] Settings tab opens; destructive actions show confirm dialog
