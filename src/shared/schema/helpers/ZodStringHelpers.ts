import {z} from "zod";
import {Types} from "mongoose";

/**
 * A required trimmed string schema.
 *
 * This schema ensures the value is a non-empty string with leading and trailing whitespace removed.
 * Useful for validating standard required string inputs such as names or titles.
 *
 * @example
 * const result = RequiredString.parse("  Hello  "); // "Hello"
 */
export const RequiredStringSchema = z
    .string({required_error: "Required.", invalid_type_error: "Must be a valid string."})
    .min(1, "Must be at least 1 character long.")
    .trim();

/**
 * A URL string schema.
 *
 * Validates that the value is a properly formatted URL string.
 * Suitable for fields such as website URLs or image links.
 *
 * @example
 * const result = ValidURLStringSchema.parse("https://example.com"); // "https://example.com"
 */
export const ValidURLStringSchema = z
    .string({required_error: "Required.", invalid_type_error: "Must be a valid URL string."})
    .url({message: "Must be a valid URL."});

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

/**
 * A Zod schema that parses a valid ObjectID string into a `mongoose.Types.ObjectId` instance.
 *
 * Builds on `ObjectIdStringSchema` by transforming the string into an actual ObjectId object.
 * Useful when working directly with MongoDB document IDs in code.
 *
 * @example
 * const objectId = ObjectIdStringSchema.parse("507f1f77bcf86cd799439011");
 * console.log(objectId instanceof Types.ObjectId); // true
 */
export const ParsedObjectIdStringSchema = ObjectIdStringSchema
    .transform((_id) => new Types.ObjectId(_id));

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