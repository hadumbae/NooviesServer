import { z } from "zod";
import { ObjectIdSchema } from "./ObjectIdSchema.js";

/**
 * Schema for validating an array of MongoDB ObjectIds.
 *
 * @remarks
 * - Each element in the array is validated using {@link ObjectIdSchema}.
 * - Throws `"Required."` if the value is `undefined` or `null`.
 * - Throws `"Must be a valid array of ObjectIds."` if the input is not a proper array
 *   or contains invalid ObjectId elements.
 * - Useful for fields referencing multiple documents in a MongoDB collection,
 *   such as `movieIds`, `userIds`, etc.
 *
 * @example
 * ```ts
 * ObjectIdArraySchema.parse([
 *   "67238c245d6e7e92e5c3219a",
 *   new Types.ObjectId()
 * ]); // ✅ passes, returns array of Types.ObjectId
 *
 * ObjectIdArraySchema.parse([]); // ✅ passes, empty array is valid
 *
 * ObjectIdArraySchema.parse(["invalid-id"]); // ❌ throws ZodError
 * ObjectIdArraySchema.parse("not-an-array"); // ❌ throws ZodError
 * ```
 */
export const ObjectIdArraySchema = z.array(ObjectIdSchema, {
    required_error: "Required.",
    invalid_type_error: "Must be a valid array of ObjectIds.",
});

/**
 * TypeScript type representing an array of validated MongoDB ObjectIds.
 *
 * @remarks
 * - Inferred from {@link ObjectIdArraySchema}.
 * - Ensures each element is a properly transformed `Types.ObjectId`.
 */
export type ObjectIdArray = z.infer<typeof ObjectIdArraySchema>;
