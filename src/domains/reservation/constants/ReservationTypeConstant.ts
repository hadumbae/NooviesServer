/**
 * @file ReservationTypeConstant.ts
 *
 * Supported reservation types for showings.
 *
 * @remarks
 * Used as a source of truth for reservation mode enums,
 * typically paired with Zod enums or union types.
 */
const ReservationTypeConstant = [
    "GENERAL_ADMISSION",
    "RESERVED_SEATS",
] as const;

export {
    ReservationTypeConstant
};
