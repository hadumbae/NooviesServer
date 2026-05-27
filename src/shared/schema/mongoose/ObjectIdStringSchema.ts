/**
 * @fileoverview Zod schema for validating MongoDB ObjectId strings.
 */

import {z} from "zod";
import {Types} from "mongoose";

/** Schema that validates a string is a 24-character hex MongoDB ObjectId. */
export const ObjectIdStringSchema = z
    .string({required_error: "Required.", invalid_type_error: "Must be a valid ID string."})
    .length(24, "ID String must be exactly 24 characters.")
    .refine((value) => Types.ObjectId.isValid(value));