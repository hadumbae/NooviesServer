/**
 * @fileoverview Defines the schema and type for movie credit classifications.
 */

import {CreditTypeConstant} from "@/domains/movie-credits/_validation/fields/CreditTypeConstant";
import {z} from "zod";

/** Zod schema for validating credit type strings against allowed constants. */
export const CreditTypeSchema = z.enum(CreditTypeConstant, {
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) {
            return {message: "Invalid value."};
        }

        if (issue.code === z.ZodIssueCode.invalid_type) {
            return {message: "Must be a valid string value."};
        }

        return {message: ctx.defaultError};
    },
});

/** TypeScript type inferred from the CreditTypeSchema. */
export type CreditType = z.infer<typeof CreditTypeSchema>;