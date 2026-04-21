/**
 * @fileoverview Validation schema for Screen types (technological formats).
 * Enforces a strict set of values representing auditorium classifications.
 */

import {z} from 'zod';
import {ScreenTypeConstant} from "@domains/screen/validation/ScreenTypeConstant";

/**
 * Zod schema for validating cinema screen classifications.
 */
export const ScreenTypeSchema = z.enum(ScreenTypeConstant, {
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) return {message: "Invalid Screen Type."};
        if (issue.code === z.ZodIssueCode.invalid_type) return {message: "Must be a screen type."};
        return {message: ctx.defaultError};
    },
});

/**
 * TypeScript type representing the valid set of technological screen formats.
 */
export type ScreenType = z.infer<typeof ScreenTypeSchema>;