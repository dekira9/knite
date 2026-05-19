import { calculateRaglan } from "../../../utils/calculateRaglan.ts";

declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const result = calculateRaglan({
      headCircumference: body.headCircumference,
      neckCircumference: body.neckCircumference,
      chestCircumference: body.chestCircumference,
      stitchDensity: body.stitchDensity,
      rowDensity: body.rowDensity,
      fitType: body.fitType,
      ribbingWidth: body.ribbingWidth,
      ribbingWidthV: body.ribbingWidthV,
      raglanLineWidth: body.raglanLineWidth,
      raglanLineWidthV: body.raglanLineWidthV,
      depthNeckV: body.depthNeckV,
      measurementSystem: body.measurementSystem,
    });

    if (typeof result === "string") {
      return new Response(
        JSON.stringify({ error: result }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

