import { z } from "zod";

export interface TelemetryDeviation {
  path: string;
  code: string;
  expected?: string;
  received?: string;
  message: string;
}

export interface TelemetryPayload {
  timestamp: string;
  endpoint: string;
  prompt: string;
  errorType: "PARSING" | "VALIDATION";
  errorMessage: string;
  deviations: TelemetryDeviation[];
  rawPayload: string;
}

export interface FetchZodBoundaryParams {
  prompt: string;
  schema: z.ZodTypeAny;
  fallback: unknown;
  locale?: string;
  injectChaosType?: "none" | "malformed_json" | "schema_mismatch";
  onTelemetryLogged?: (payload: TelemetryPayload) => void;
}

export interface FetchZodBoundaryResult {
  success: boolean;
  data: unknown;
  errorType?: "none" | "parsing" | "validation";
  errorMessage?: string;
  deviations?: TelemetryDeviation[];
  telemetrySent?: boolean;
}

export interface GeminiResponseSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  items?: unknown;
  enum?: string[];
}

interface CustomError extends Error {
  isParseError?: boolean;
  isValidationError?: boolean;
  rawOutput?: string;
  errors?: unknown[];
  receivedData?: unknown;
}

export const createJSONParseError = (message: string, rawOutput: string): CustomError => {
  const err: CustomError = new Error(message);
  err.name = "JSONParseError";
  err.isParseError = true;
  err.rawOutput = rawOutput;
  return err;
};

export const createValidationError = (message: string, errors: unknown[], receivedData: unknown): CustomError => {
  const err: CustomError = new Error(message);
  err.name = "ValidationError";
  err.isValidationError = true;
  err.errors = errors;
  err.receivedData = receivedData;
  return err;
};

/**
 * Resolves a potentially nested or wrapped Zod schema to its ultimate underlying type.
 * Unwraps optionals, nullables, and effects (refining/transforming) recursively without while loops.
 */
export const unwrapZodType = (schema: z.ZodTypeAny): z.ZodTypeAny => {
  const def = schema._def as unknown as { typeName?: string; innerType?: z.ZodTypeAny; schema?: z.ZodTypeAny };
  if (!def || !def.typeName) {
    return schema;
  }
  switch (def.typeName) {
    case "ZodOptional":
    case "ZodNullable":
      return def.innerType ? unwrapZodType(def.innerType) : schema;
    case "ZodEffects":
      return def.schema ? unwrapZodType(def.schema) : schema;
    default:
      return schema;
  }
};

/**
 * Converts a Zod Schema object to Gemini's expected ResponseSchema JSON Format.
 * This is configured on the server-side to guarantee strict structured outputs.
 */
export const zodToGeminiSchema = (schema: z.ZodTypeAny): GeminiResponseSchema => {
  const unwrapped = unwrapZodType(schema);
  const def = unwrapped._def as unknown as { 
    typeName?: string; 
    shape?: () => Record<string, z.ZodTypeAny>;
    type?: z.ZodTypeAny;
    checks?: Array<{ kind: string }>;
    values?: string[];
  };

  if (!def || !def.typeName) {
    return { type: "STRING" };
  }

  switch (def.typeName) {
    case "ZodObject": {
      const rawShape = (unwrapped as unknown as { shape?: Record<string, z.ZodTypeAny> }).shape;
      const shape = rawShape || (def.shape ? def.shape() : {} as Record<string, z.ZodTypeAny>);
      const properties: Record<string, unknown> = {};
      const required: string[] = [];

      Object.keys(shape).forEach((key) => {
        const fieldSchema = shape[key];
        properties[key] = zodToGeminiSchema(fieldSchema);

        const fieldDef = fieldSchema._def as unknown as { typeName?: string };
        const isOptional = fieldDef?.typeName === "ZodOptional";
        if (!isOptional) {
          required.push(key);
        }
      });

      return {
        type: "OBJECT",
        properties,
        required: required.length > 0 ? required : undefined,
      };
    }

    case "ZodArray": {
      const element = (unwrapped as unknown as { element?: z.ZodTypeAny }).element || def.type;
      return {
        type: "ARRAY",
        items: element ? zodToGeminiSchema(element) : { type: "STRING" },
      };
    }

    case "ZodString":
      return { type: "STRING" };

    case "ZodNumber": {
      const checks = def.checks || [];
      const hasIntCheck = checks.some((c) => c.kind === "int");
      const hasIntDesc = unwrapped.description?.toLowerCase().includes("int") || false;
      return { type: (hasIntCheck || hasIntDesc) ? "INTEGER" : "NUMBER" };
    }

    case "ZodBoolean":
      return { type: "BOOLEAN" };

    case "ZodEnum": {
      const options = ((unwrapped as unknown as { options?: string[] }).options || def.values || []) as string[];
      return {
        type: "STRING",
        enum: options,
      };
    }

    default:
      return { type: "STRING" };
  }
};

/**
 * Executes a structured client network call passing prompt and Gemini Schema,
 * parses raw non-deterministic models responses, processes deep Zod checks,
 * triggers real-time telemetry if needed, and applies standard fallback safety frames.
 */
export const fetchWithZodBoundary = async (params: FetchZodBoundaryParams): Promise<FetchZodBoundaryResult> => {
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
      const errBody = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(errBody.error || "Internal service fetching error");
    }

    const resJson = (await response.json()) as { rawResult?: string };
    const rawOutput = resJson.rawResult || "";

    // Standard raw output validation phase.
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawOutput);
    } catch (parseError: unknown) {
      const syntaxError = parseError as Error;
      throw createJSONParseError(
        `Failed to parse response as JSON. Syntax error: ${syntaxError.message}`,
        rawOutput
      );
    }

    // Zod boundary schema validation check
    const validationResult = schema.safeParse(parsed);
    if (!validationResult.success) {
      const issues = validationResult.error.issues || [];
      throw createValidationError(
        "Zod runtime validation failed: returned structure diverges from schema target.",
        issues,
        parsed
      );
    }

    // Success state - fully typed, validated, and sound!
    return {
      success: true,
      data: validationResult.data,
      errorType: "none",
    };
  } catch (error: unknown) {
    console.error("Boundary Validation Exception Caught:", error);

    const err = error as CustomError;
    const isParseErr = !!err.isParseError;
    const isValErr = !!err.isValidationError;

    const issuesList = (err.errors || []) as Array<{
      path: Array<string | number>;
      code: string;
      message: string;
      expected?: string;
      received?: string;
    }>;

    const deviations: TelemetryDeviation[] = isValErr
      ? issuesList.map((iss) => ({
          path: iss.path.join("."),
          code: iss.code,
          message: iss.message,
          expected: iss.expected,
          received: iss.received,
        }))
      : [];

    const telemetry: TelemetryPayload = {
      timestamp: new Date().toISOString(),
      endpoint: "/api/zod-fetch",
      prompt,
      errorType: isParseErr ? "PARSING" : "VALIDATION",
      errorMessage: err.message || "Unknown fetching error",
      deviations,
      rawPayload: isParseErr ? (err.rawOutput || "") : JSON.stringify(isValErr ? err.receivedData : err),
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
      errorMessage: err.message || "Boundary fetch failed.",
      deviations: isValErr ? deviations : undefined,
      telemetrySent,
    };
  }
};
