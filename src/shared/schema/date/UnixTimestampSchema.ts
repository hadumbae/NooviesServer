import {z} from "zod";

import {CoercedNumberSchema} from "../numbers/CoercedNumberSchema.js";

/**
 * Zod schema validating a UNIX timestamp (in seconds) with multiple safeguards:
 *
 * 1. Coerces input (e.g., `"1687000000"`) into a number.
 * 2. Requires the value to be an integer.
 * 3. Ensures it is non-negative.
 * 4. Enforces a minimum value of 946,684,800 (≈ Jan 1, 2000) to avoid outdated timestamps.
 * 5. Enforces a maximum of now-plus-60 seconds to prevent future-dated values.
 *
 * @remarks
 * Adjust the `gte` or `lte` thresholds if your application demands different time ranges.
 * This schema is ideal for validating numeric epoch timestamps, such as those returned
 * by services like Cloudinary or custom APIs.
 *
 * @example
 * ```ts
 * UnixTimestampSchema.parse("1687000000");  // ✅ passes → 1687000000
 * UnixTimestampSchema.parse(1687000000);    // ✅ passes
 * UnixTimestampSchema.parse(1687000000.5);  // ❌ fails: "Must be an integer."
 * UnixTimestampSchema.parse(-5);            // ❌ fails: "Must not be negative."
 * UnixTimestampSchema.parse(0);             // ❌ fails: "Timestamp is too old."
 * UnixTimestampSchema.parse(9999999999);    // ❌ fails: "Timestamp seems to be in the future!"
 * ```
 */
export const UnixTimestampSchema = CoercedNumberSchema
    .int({message: "Must be an integer."})
    .nonnegative({message: "Must not be negative."})
    .gte(946684800, {message: "Timestamp is too old."})
    .lte(Math.floor(Date.now() / 1000) + 60, {message: "Timestamp seems to be in the future!"});

/**
 * Type representing a valid UNIX timestamp (seconds since epoch),
 * as validated by {@link UnixTimestampSchema}.
 */
export type UnixTimestamp = z.infer<typeof UnixTimestampSchema>;