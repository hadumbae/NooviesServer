import {z} from "zod";

/**
 * @file BookingErrorCode.schema.ts
 *
 * Zod schema and types for booking-related error codes.
 */

/**
 * Supported booking error code literals.
 *
 * @remarks
 * These codes are intended for client-safe error handling
 * and should remain stable once exposed.
 */
export const BOOKING_ERROR_CODES = [
    "ERR_SCREEN_FULL",
    "ERR_SHOWING_CANCELLED",
    "ERR_SEAT_RESERVED",
    "ERR_INVALID_RESERVATION",
    "ERR_INVALID_RESERVATION_TYPE",
    "ERR_RESERVATION_NOT_FOUND",
    "ERR_UNAUTHORIZED",
    "ERR_RESERVATION_EXPIRED",
] as const;

/**
 * Zod enum schema for {@link BOOKING_ERROR_CODES}.
 *
 * @remarks
 * Provides user-friendly error messages for invalid values
 * and invalid input types.
 */
export const BookingErrorCodeSchema = z.enum(
    BOOKING_ERROR_CODES,
    {
        errorMap: (issue, ctx) => {
            if (issue.code === z.ZodIssueCode.invalid_enum_value) {
                return {message: "Invalid value."};
            }

            if (issue.code === z.ZodIssueCode.invalid_type) {
                return {message: "Must be a valid string."};
            }

            return {message: ctx.defaultError};
        },
    }
);

/**
 * Inferred booking error code union type.
 */
export type BookingErrorCode = z.infer<typeof BookingErrorCodeSchema>;
