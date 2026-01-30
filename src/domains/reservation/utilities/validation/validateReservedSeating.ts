/**
 * Validate seating selection consistency based on reservation type.
 *
 * @remarks
 * Intended for use within Zod `superRefine` callbacks.
 * Performs structural validation only; business rules
 * are enforced elsewhere.
 *
 * @param type - Reservation mode (general admission vs reserved seating)
 * @param selectedSeating - Selected seat ObjectIds, if applicable
 * @param ctx - Zod refinement context for reporting validation issues
 */
import { Types } from "mongoose";
import type { RefinementCtx } from "zod";
import type { ReservationType } from "../../schemas/enum/ReservationTypeEnumSchema.js";

export const validateReservedSeating = function (
    reservationType: ReservationType,
    selectedSeating: Types.ObjectId[] | undefined | null,
    ctx: RefinementCtx,
): void {
    if (reservationType === "GENERAL_ADMISSION" && Array.isArray(selectedSeating)) {
        ctx.addIssue({
            code: "invalid_type",
            path: ["selectedSeating"],
            expected: "null",
            received: typeof selectedSeating,
            message: "Must be empty for general admission.",
        });
    }

    if (reservationType === "RESERVED_SEATS" && !Array.isArray(selectedSeating)) {
        ctx.addIssue({
            code: "invalid_type",
            path: ["selectedSeating"],
            expected: "array",
            received: typeof selectedSeating,
            message: "Required for reserved seating.",
        });
    }
};
