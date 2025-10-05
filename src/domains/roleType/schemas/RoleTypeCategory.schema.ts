import {z} from "zod";
import RoleTypeCastCategoryConstant from "../constants/RoleTypeCastCategoryConstant.js";
import RoleTypeCrewCategoryConstant from "../constants/RoleTypeCrewCategoryConstant.js";

/**
 * Zod schema for cast role categories.
 *
 * @remarks
 * Validates that a given value matches one of the constants defined in
 * {@link RoleTypeCastCategoryConstant}.
 *
 * **Validation behavior:**
 * - Missing value → `"Required."`
 * - Non-string value → `"Must be a valid string."`
 * - Value not in the enum → `"Invalid Value."`
 */
export const RoleTypeCastCategoryEnumSchema = z.enum(RoleTypeCastCategoryConstant, {
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) return {message: "Invalid Value."};
        if (issue.code === z.ZodIssueCode.invalid_type) return {message: "Must be a valid string."};
        return {message: ctx.defaultError};
    },
});

/**
 * Represents a valid cast role category value.
 *
 * @see {@link RoleTypeCastCategoryEnumSchema}
 */
export type RoleTypeCastCategory = z.infer<typeof RoleTypeCastCategoryEnumSchema>;

/**
 * Zod schema for crew role categories.
 *
 * @remarks
 * Validates that a given value matches one of the constants defined in
 * {@link RoleTypeCrewCategoryConstant}.
 *
 * **Validation behavior:**
 * - Missing value → `"Required."`
 * - Non-string value → `"Must be a valid string."`
 * - Value not in the enum → `"Invalid Value."`
 */
export const RoleTypeCrewCategoryEnumSchema = z.enum(RoleTypeCrewCategoryConstant, {
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) return {message: "Invalid Value."};
        if (issue.code === z.ZodIssueCode.invalid_type) return {message: "Must be a valid string."};
        return {message: ctx.defaultError};
    },
});