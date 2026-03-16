import { z } from "zod";
import ShowingStatusConstant from "../constants/ShowingStatusConstant.js";

/**
 * Zod schema for validating a showing's status.
 *
 * @description
 * This schema enforces that a status value must be one of the
 * allowed `ShowingStatusConstant` values.
 *
 * If an invalid value is provided, the schema will throw a validation
 * error with the message `"Invalid status code."`.
 *
 * @example
 * ```ts
 * ShowingStatusEnumSchema.parse("RUNNING"); // ✅ valid
 * ShowingStatusEnumSchema.parse("PAUSED");  // ❌ throws validation error
 * ```
 */
export const ShowingStatusEnumSchema = z.enum(ShowingStatusConstant, {
    message: "Invalid status code.",
});

/**
 * TypeScript type representing a valid showing status.
 *
 * @remarks
 * Derived from `ShowingStatusEnumSchema` using `z.infer`.
 * Can be used in interfaces, function parameters, or anywhere
 * a showing status is required.
 *
 * @example
 * ```ts
 * let status: ShowingStatusEnum;
 * status = "SCHEDULED"; // ✅ valid
 * status = "PAUSED";    // ❌ TypeScript error
 * ```
 */
export type ShowingStatusCode = z.infer<typeof ShowingStatusEnumSchema>;
