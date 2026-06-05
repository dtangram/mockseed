import { z } from "zod";

/**
 * Resolves a potentially nested or wrapped Zod schema to its ultimate underlying type.
 * Unwraps optionals, nullables, and effects (refining/transforming).
 */
export function unwrapZodType(schema: any): any {
  let current = schema;
  while (current && current._def) {
    const typeName = current._def.typeName;
    if (typeName === "ZodOptional" || typeName === "ZodNullable") {
      current = current._def.innerType;
    } else if (typeName === "ZodEffects") {
      current = current._def.schema;
    } else {
      break;
    }
  }
  return current;
}

/**
 * Converts a Zod Schema object to Gemini's expected ResponseSchema JSON Format.
 * This is configured on the server-side to guarantee strict structured outputs.
 */
export function zodToGeminiSchema(schema: any): any {
  const unwrapped = unwrapZodType(schema);
  if (!unwrapped || !unwrapped._def) {
    return { type: "STRING" };
  }

  const typeName = unwrapped._def.typeName;

  if (typeName === "ZodObject") {
    const shape = unwrapped.shape || (unwrapped._def.shape ? unwrapped._def.shape() : {});
    const properties: Record<string, any> = {};
    const required: string[] = [];

    for (const key of Object.keys(shape)) {
      const fieldSchema = shape[key];
      properties[key] = zodToGeminiSchema(fieldSchema);

      // A field is required if it is NOT an optional type
      const isOptional = fieldSchema && (
        fieldSchema._def?.typeName === "ZodOptional" || 
        (fieldSchema as any).isOptional?.() || 
        false
      );
      if (!isOptional) {
        required.push(key);
      }
    }

    return {
      type: "OBJECT",
      properties,
      required: required.length > 0 ? required : undefined,
    };
  }

  if (typeName === "ZodArray") {
    const element = unwrapped.element || unwrapped._def.type;
    return {
      type: "ARRAY",
      items: zodToGeminiSchema(element),
    };
  }

  if (typeName === "ZodString") {
    return { type: "STRING" };
  }

  if (typeName === "ZodNumber") {
    const isInteger = unwrapped.description?.toLowerCase().includes("int") || 
                      unwrapped._def.checks?.some((c: any) => c.kind === "int") || 
                      false;
    return { type: isInteger ? "INTEGER" : "NUMBER" };
  }

  if (typeName === "ZodBoolean") {
    return { type: "BOOLEAN" };
  }

  if (typeName === "ZodEnum") {
    return {
      type: "STRING",
      enum: unwrapped.options || unwrapped._def.values || [],
    };
  }

  // Fallback default
  return { type: "STRING" };
}

/**
 * Granular error classification to differentiate between syntax (malformed JSON)
 * and validation integrity issues (Zod schema mismatch).
 */
export class JSONParseError extends Error {
  constructor(message: string, public rawOutput: string) {
    super(message);
    this.name = "JSONParseError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public errors: any[], public receivedData: any) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Interface representing telemetry logs transmitted to tracking boundary interfaces.
 */
export interface TelemetryPayload {
  timestamp: string;
  endpoint: string;
  prompt: string;
  errorType: "PARSING" | "VALIDATION";
  errorMessage: string;
  deviations: Array<{
    path: string;
    code: string;
    expected?: string;
    received?: string;
    message: string;
  }>;
  rawPayload: string;
}

/**
 * Executes a structured client network call passing prompt and Gemini Schema,
 * parses raw non-deterministic models responses, processes deep Zod checks,
 * triggers real-time telemetry if needed, and applies standard fallback safety frames.
 */
export async function fetchWithZodBoundary<TSchema extends z.ZodTypeAny>(params: {
  prompt: string;
  schema: TSchema;
  fallback: z.infer<TSchema>;
  locale?: string;
  injectChaosType?: "none" | "malformed_json" | "schema_mismatch";
  onTelemetryLogged?: (payload: TelemetryPayload) => void;
}): Promise<{
  success: boolean;
  data: z.infer<TSchema>;
  errorType?: "none" | "parsing" | "validation";
  errorMessage?: string;
  deviations?: any[];
  telemetrySent?: boolean;
}> {
  const { prompt, schema, fallback, locale = "English (US)", injectChaosType = "none", onTelemetryLogged } = params;

  // Convert schema to Gemini payload schema configuration
  const geminiResponseSchema = zodToGeminiSchema(schema);

  try {
    const response = await fetch("/api/zod-fetch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        responseSchema: geminiResponseSchema,
        locale,
        injectChaosType,
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || "Internal service fetching error");
    }

    const resJson = await response.json();
    const rawOutput = resJson.rawResult;

    // Standard raw output validation phase.
    let parsed: any;
    try {
      parsed = JSON.parse(rawOutput);
    } catch (parseError: any) {
      throw new JSONParseError(
        `Failed to parse response as JSON. Syntax error: ${parseError.message}`,
        rawOutput
      );
    }

    // Zod boundary schema validation check
    const validationResult = schema.safeParse(parsed);
    if (!validationResult.success) {
      throw new ValidationError(
        "Zod runtime validation failed: returned structure diverges from schema target.",
        validationResult.error.issues || (validationResult.error as any).errors || [],
        parsed
      );
    }

    // Success state - fully typed, validated, and sound!
    return {
      success: true,
      data: validationResult.data,
      errorType: "none",
    };
  } catch (error: any) {
    console.error("Boundary Validation Exception Caught:", error);

    // Build the Telemetry Logger payload
    const isParseErr = error instanceof JSONParseError;
    const isValErr = error instanceof ValidationError;

    const telemetry: TelemetryPayload = {
      timestamp: new Date().toISOString(),
      endpoint: "/api/zod-fetch",
      prompt,
      errorType: isParseErr ? "PARSING" : "VALIDATION",
      errorMessage: error.message || "Unknown fetching error",
      deviations: isValErr
        ? error.errors.map((iss: any) => ({
            path: iss.path.join("."),
            code: iss.code,
            message: iss.message,
            expected: (iss as any).expected,
            received: (iss as any).received,
          }))
        : [],
      rawPayload: isParseErr ? error.rawOutput : JSON.stringify(isValErr ? error.receivedData : error),
    };

    // Log telemetry to backend & trigger callback
    let telemetrySent = false;
    try {
      const trackingResponse = await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telemetry),
      });
      if (trackingResponse.ok) {
        telemetrySent = true;
      }
    } catch (telemetryErr) {
      console.error("Failed to transmit telemetry logs to analytics:", telemetryErr);
    }

    if (onTelemetryLogged) {
      onTelemetryLogged(telemetry);
    }

    // Gracefully recover to high quality UI Fallback layout instead of crash
    return {
      success: false,
      data: fallback,
      errorType: isParseErr ? "parsing" : "validation",
      errorMessage: error.message || "Boundary fetch failed.",
      deviations: isValErr ? telemetry.deviations : undefined,
      telemetrySent,
    };
  }
}
