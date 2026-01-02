/**
 * @file SlugStringSchema.ts
 *
 * Zod schema for normalizing slug input.
 *
 * This schema intentionally **discards any provided value** and always
 * transforms the result to `undefined`. It is useful for:
 * - Explicitly disabling slug input
 * - Overriding client-provided slugs
 * - Allowing schema composition without exposing slug mutability
 */

import { z } from "zod";

/**
 * Slug normalization schema.
 *
 * Accepts any input, allows omission, and always resolves to `undefined`.
 *
 * @returns `undefined` regardless of input value.
 */
export const SlugStringSchema = z
    .any()
    .optional()
    .transform((): string | undefined => undefined);
