/**
 * @fileoverview Defines the validation schema and type for showing status codes.
 */

import {z} from "zod";
import {ShowingStatusConstant} from "@/domains/showing/_validation/fields/ShowingStatusConstant";
import {ZodEnumParamHandler} from "@/shared/_feat";

/** Zod schema for validating showing status strings against allowed constants. */
export const ShowingStatusSchema = z.enum(ShowingStatusConstant, ZodEnumParamHandler({
    invalidType: "Must be a valid Showing Status string.",
    invalidValue: "Must be a valid Showing Status."
}));

/** Type definition for a valid showing status code. */
export type ShowingStatusCode = z.infer<typeof ShowingStatusSchema>;
