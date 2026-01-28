/**
 * @file ReservationTypeEnumSchema.ts
 *
 * Zod enum schema for reservation types.
 *
 * Validates reservation mode values derived from
 * {@link ReservationTypeConstant}.
 */

import {z} from "zod";
import {ReservationTypeConstant} from "../../constants/ReservationTypeConstant.js";

/**
 * Zod schema for reservation type values.
 *
 * @remarks
 * Provides strict validation with user-friendly error messages
 * for both invalid enum values and incorrect types.
 */
export const ReservationTypeEnumSchema = z.enum(ReservationTypeConstant, {
    errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_enum_value) return {message: "Invalid Value."};
        if (issue.code === z.ZodIssueCode.invalid_type) return {message: "Must be a valid string."};
        return {message: ctx.defaultError};
    },
});

/**
 * TypeScript union of supported reservation types.
 *
 * Inferred directly from {@link ReservationTypeEnumSchema}.
 */
export type ReservationType = z.infer<typeof ReservationTypeEnumSchema>;
