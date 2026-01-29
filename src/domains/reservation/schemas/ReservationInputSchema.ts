/**
 * @file ReservationInputSchema.ts
 *
 * Zod schema for validating reservation create and update requests
 * at the API boundary.
 *
 * Extends the base ticket checkout input with:
 * - Reservation lifecycle status
 * - Status-dependent lifecycle timestamps
 * - Optional internal notes
 *
 * Performs cross-field validation to enforce:
 * - Required lifecycle dates based on {@link ReservationStatus}
 * - Seating constraints based on {@link ReservationTypeEnumSchema}
 *
 * @remarks
 * This schema is intentionally limited to structural and
 * consistency validation. Business rules such as lifecycle
 * transitions, expiration timing, and state enforcement are
 * handled at the model and service layers.
 */

import {z} from "zod";
import {
    type ReservationStatus,
    ReservationStatusEnumSchema,
} from "./enum/ReservationStatusEnumSchema.js";
import {NonEmptyStringSchema} from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import {UTCDateOnlySchema} from "../../../shared/schema/date-time/UTCDateOnlySchema.js";
import {validateReservedSeating} from "../utilities/validation/validateReservedSeating.js";
import {TicketCheckoutInputBaseSchema} from "./TicketCheckoutInputSchema.js";

/**
 * Base reservation input schema including lifecycle metadata.
 */
export const ReservationInputBaseSchema = TicketCheckoutInputBaseSchema.extend({
    /**
     * Expiration timestamp for unpaid reservations.
     *
     * @remarks
     * Required for active reservations and validated
     * further at the model layer.
     */
    expiresAt: UTCDateOnlySchema.optional(),

    /** Current lifecycle status of the reservation. */
    status: ReservationStatusEnumSchema,

    /** Optional internal notes or operational context. */
    notes: NonEmptyStringSchema
        .max(3000, "Must be 3000 characters or less.")
        .optional(),
});

/**
 * Reservation input schema with cross-field validation applied.
 */
export const ReservationInputSchema = ReservationInputBaseSchema.superRefine((values, ctx) => {
    const {type, selectedSeating} = values;
    validateReservedSeating(type, selectedSeating, ctx);
});

/**
 * Type representing validated reservation input payload.
 */
export type ReservationInputData = z.infer<typeof ReservationInputSchema>;
