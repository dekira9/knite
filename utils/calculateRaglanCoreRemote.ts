import { supabase } from "@/lib/supabase";
import type { RaglanOutput } from "@/utils/calculateRaglan";

export interface RaglanRemoteInput {
  headCircumference: string;
  neckCircumference: string;
  chestCircumference: string;
  stitchDensity: string;
  rowDensity: string;
  fitType: string;
  ribbingWidth: number | string;
  ribbingWidthV: number | string;
  raglanLineWidth: number;
  raglanLineWidthV: number;
  depthNeckV?: number;
  measurementSystem?: string;
}

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

