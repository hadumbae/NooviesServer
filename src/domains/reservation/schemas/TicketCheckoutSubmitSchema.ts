/**
 * @file TicketCheckoutInputSchema.ts
 *
 * Base Zod schema for validating ticket checkout input
 * prior to reservation lifecycle processing.
 *
 * Defines the minimal payload required to initiate a reservation:
 * - Showing reference
 * - Ticket quantity
 * - Optional seating selection
 * - Pricing and currency metadata
 * - Reservation type
 *
 * @remarks
 * This schema is intentionally lifecycle-agnostic.
 * Reservation status, expiration, ownership, and timestamps
 * are introduced and validated by higher-level schemas.
 */

import { z } from "zod";
import { ObjectIdSchema } from "../../../shared/schema/mongoose/ObjectIdSchema.js";
import generateArraySchema from "../../../shared/utility/schema/generateArraySchema.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { ISO4217CurrencyCodeEnumSchema } from "../../../shared/schema/enums/ISO4217CurrencyCodeEnumSchema.js";
import { ReservationTypeEnumSchema } from "./enum/ReservationTypeEnumSchema.js";
import { validateReservedSeating } from "../utilities/validation/validateReservedSeating.js";

/**
 * Base checkout submission schema.
 *
 * Validates the structural correctness of checkout input
 * without applying reservation lifecycle constraints.
 */
export const TicketCheckoutSubmitBaseSchema = z.object({
    /** Showing being reserved. */
    showing: ObjectIdSchema,

    /** Number of tickets included in the checkout. */
    ticketCount: PositiveNumberSchema,

    /** Total price paid or payable for the reservation. */
    pricePaid: PositiveNumberSchema,

    /** Currency used for pricing (ISO 4217). */
    currency: ISO4217CurrencyCodeEnumSchema,

    /** Reservation mode (general admission vs reserved seating). */
    reservationType: ReservationTypeEnumSchema,

    /**
     * Selected seating identifiers.
     *
     * @remarks
     * Required for reserved seating and forbidden
     * for general admission.
     */
    selectedSeating: generateArraySchema(ObjectIdSchema)
        .min(1, { message: "Must not be an empty array." })
        .optional()
        .nullable(),
});

/**
 * Checkout submission schema with seating constraints applied.
 *
 * Performs cross-field validation to ensure seating selection
 * aligns with the chosen reservation type.
 */
export const TicketCheckoutSubmitSchema =
    TicketCheckoutSubmitBaseSchema.superRefine((values, ctx) => {
        const { reservationType, selectedSeating } = values;
        validateReservedSeating(reservationType, selectedSeating, ctx);
    });

/**
 * Type representing validated checkout submission payload.
 */
export type TicketCheckoutSubmitData =
    z.infer<typeof TicketCheckoutSubmitSchema>;
