import { z } from "zod";
import { URLParamBooleanSchema } from "../url/URLParamBooleanSchema.js";
import { URLParamNumberSchema } from "../url/URLParamNumberSchema.js";

/**
 * Schema for validating optional query parameters that control response behavior.
 *
 * @remarks
 * - Includes parameters often used in APIs to customize results:
 *   - `populate` – whether to populate related documents
 *   - `virtuals` – whether to include virtual fields
 *   - `paginated` – whether the response should be paginated
 *   - `limit` – maximum number of items to return
 * - Each parameter is validated using URL parameter schemas:
 *   - Boolean parameters: {@link URLParamBooleanSchema}
 *   - Numeric parameters: {@link URLParamNumberSchema}
 *
 * @example
 * ```ts
 * // Valid input
 * QueryOptionParamsSchema.parse({
 *   populate: "true",
 *   virtuals: "false",
 *   paginated: "true",
 *   limit: "50",
 * });
 * // ✅ returns { populate: true, virtuals: false, paginated: true, limit: 50 }
 *
 * // Invalid input
 * QueryOptionParamsSchema.parse({ populate: "yes" });
 * // ❌ throws ZodError from URLParamBooleanSchema
 * ```
 */
export const QueryOptionParamsSchema = z.object({
   populate: URLParamBooleanSchema,
   virtuals: URLParamBooleanSchema,
   paginated: URLParamBooleanSchema,
   limit: URLParamNumberSchema,
});

/**
 * TypeScript type representing validated query option parameters.
 *
 * @remarks
 * - Inferred from {@link QueryOptionParamsSchema}.
 * - Ensures boolean flags and numeric limits are properly typed.
 */
export type QueryOptionParams = z.infer<typeof QueryOptionParamsSchema>;
