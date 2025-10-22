import {Types} from "mongoose";
import {ObjectIdStringSchema} from "./ObjectIdStringSchema.js";
import {z} from "zod";

/**
 * Schema for validating and coercing MongoDB ObjectId values.
 *
 * @remarks
 * - Accepts either:
 *   1. A string that matches {@link ObjectIdStringSchema}.
 *   2. An instance of `Types.ObjectId`.
 * - Automatically transforms valid strings into `Types.ObjectId` instances.
 * - Useful for API inputs or form data where the ID may be provided as a string.
 *
 * @example
 * ```ts
 * ObjectIdSchema.parse("67238c245d6e7e92e5c3219a"); // ✅ Returns Types.ObjectId
 * ObjectIdSchema.parse(new Types.ObjectId());        // ✅ Returns same Types.ObjectId instance
 * ObjectIdSchema.parse("invalid-id");                // ❌ Throws ZodError
 * ```
 */
export const ObjectIdSchema = z
    .union([z.instanceof(Types.ObjectId), ObjectIdStringSchema])
    .transform(id => (typeof id === "string" ? new Types.ObjectId(id) : id));