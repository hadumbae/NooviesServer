/**
 * @fileoverview Zod schemas and TypeScript types for cast and crew role categories.
 */

import {z} from "zod";
import {
    RoleTypeCastCategoryConstant
} from "@domains/roleType/validation/constants/RoleTypeCastCategoryConstant";
import {
    RoleTypeCrewCategoryConstant
} from "@domains/roleType/validation/constants/RoleTypeCrewCategoryConstant";

/** Zod schema for validating cast role categories against predefined constants. */
export const RoleTypeCastCategorySchema = z.enum(RoleTypeCastCategoryConstant, {
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) return {message: "Invalid Value."};
        if (issue.code === z.ZodIssueCode.invalid_type) return {message: "Must be a valid string."};
        return {message: ctx.defaultError};
    },
});

/** TypeScript type representing a valid cast role category. */
export type RoleTypeCastCategory = z.infer<typeof RoleTypeCastCategorySchema>;

/** Zod schema for validating crew role categories against predefined constants. */
export const RoleTypeCrewCategorySchema = z.enum(RoleTypeCrewCategoryConstant, {
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) return {message: "Invalid Value."};
        if (issue.code === z.ZodIssueCode.invalid_type) return {message: "Must be a valid string."};
        return {message: ctx.defaultError};
    },
});

/** TypeScript type representing a valid crew role category. */
export type RoleTypeCrewCategory = z.infer<typeof RoleTypeCrewCategorySchema>;