## Supabase Raglan Core Setup

1. Create `.env` from `.env.example` and set:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
2. Deploy edge function from project root:
   - `supabase functions deploy calculate-raglan`
3. Restart Expo dev server.

After this, result screens call `syncRaglanFromSupabase()` and use the full backend calculation result from edge function `calculate-raglan` (regular and v-neck).

