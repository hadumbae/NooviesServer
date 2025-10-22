import {z} from "zod";
import {Types} from "mongoose";

/**
 * A 24-character string schema for validating MongoDB ObjectID strings.
 *
 * Ensures the string is exactly 24 characters and passes `mongoose.Types.ObjectId.isValid`.
 * Commonly used for IDs passed as strings in HTTP requests.
 *
 * @example
 * const result = ObjectIdStringSchema.parse("507f1f77bcf86cd799439011"); // valid ObjectID string
 */
export const ObjectIdStringSchema = z
    .string({required_error: "Required.", invalid_type_error: "Must be a valid ID string."})
    .length(24, "ID String must be exactly 24 characters.")
    .refine((value) => Types.ObjectId.isValid(value));