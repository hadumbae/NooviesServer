import {z} from "zod";
import {Types} from "mongoose";

/**
 * A Zod schema for parsing optional MongoDB ObjectId parameters from URLs.
 *
 * This schema:
 * - Accepts string input.
 * - Ensures the string is a valid MongoDB ObjectId.
 * - Allows `undefined` (i.e., the parameter is optional).
 * - Transforms valid strings into `Types.ObjectId` instances.
 *
 * @example
 * URLParamObjectID.parse("60d5ec49e1d3f3b1f8a9c8e7"); // -> new Types.ObjectId(...)
 * URLParamObjectID.parse(undefined); // -> undefined
 * URLParamObjectID.parse("invalid-id"); // -> throws ZodError: "Invalid ObjectId format."
 */
export const URLParamObjectIDSchema = z
    .string({invalid_type_error: "Must be a valid ID string."})
    .optional()
    .refine((value) => value === undefined || Types.ObjectId.isValid(value), {message: "Invalid ID string."})
    .transform((value) => (value ? new Types.ObjectId(value) : undefined));