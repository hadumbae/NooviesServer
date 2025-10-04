import { z } from "zod";
import RoleTypeCastCategoryConstant from "../constants/RoleTypeCastCategoryConstant.js";
import RoleTypeCrewCategoryConstant from "../constants/RoleTypeCrewCategoryConstant.js";

/**
 * Zod schema for cast role categories.
 *
 * @remarks
 * Ensures that a cast role category is one of the predefined constants
 * in `RoleTypeCastCategoryConstant`.
 *
 * Validation behavior:
 * - Missing value → "Required."
 * - Value is not a string → "Must be a valid string."
 * - Value is not in the enum → "Invalid Value."
 */
export const RoleTypeCastCategoryEnumSchema = z.enum(RoleTypeCastCategoryConstant, {
    required_error: "Required.",
    invalid_type_error: "Must be a valid string.",
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) return { message: "Invalid Value." };
        return { message: ctx.defaultError };
    },
});

/**
 * Zod schema for crew role categories.
 *
 * @remarks
 * Ensures that a crew role category is one of the predefined constants
 * in `RoleTypeCrewCategoryConstant`.
 *
 * Validation behavior:
 * - Missing value → "Required."
 * - Value is not a string → "Must be a valid string."
 * - Value is not in the enum → "Invalid Value."
 */
export const RoleTypeCrewCategoryEnumSchema = z.enum(RoleTypeCrewCategoryConstant, {
    required_error: "Required.",
    invalid_type_error: "Must be a valid string.",
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) return { message: "Invalid Value." };
        return { message: ctx.defaultError };
    },
});
