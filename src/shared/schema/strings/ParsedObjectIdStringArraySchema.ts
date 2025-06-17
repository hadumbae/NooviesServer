import {z} from "zod";

import {ParsedObjectIdStringSchema} from "./ParsedObjectIdStringSchema.js";

/**
 * A Zod schema for validating an array of valid MongoDB ObjectID strings.
 *
 * Each element in the array must be a 24-character string that passes `mongoose.Types.ObjectId.isValid`
 * and will be transformed into a `mongoose.Types.ObjectId` instance using `ParsedObjectIdStringSchema`.
 *
 * Useful when accepting or processing multiple ObjectId values, such as an array of document references.
 *
 * @example
 * const result = ParsedObjectIdStringArraySchema.parse([
 *   "507f1f77bcf86cd799439011",
 *   "507f1f77bcf86cd799439012"
 * ]);
 * console.log(result[0] instanceof Types.ObjectId); // true
 */
export const ParsedObjectIdStringArraySchema = z
    .array(ParsedObjectIdStringSchema, {
        required_error: "Required.",
        invalid_type_error: "Must be a valid array of ObjectIds."
    });