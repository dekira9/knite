import { supabase } from "@/lib/supabase";
import type { RaglanInput, RaglanOutput } from "@/utils/calculateRaglan";

/** Remote body matches `calculateRaglan` input (required raglan widths). */
export type RaglanRemoteInput = RaglanInput & {
  raglanLineWidth: number;
  raglanLineWidthV: number;
};

export async function calculateRaglanRemote(
  input: RaglanRemoteInput
): Promise<RaglanOutput | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.functions.invoke("calculate-raglan", {
    body: input,
  });

  if (error || !data) {
    return null;
  }

  return data as RaglanOutput;
}

