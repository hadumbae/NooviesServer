/**
 * @file TicketCheckout.submit.schema.ts
 *
 * Zod schemas for validating ticket checkout submissions
 * before entering the reservation lifecycle.
 *
 * Defines the minimal payload required to initiate a reservation:
 * - Showing reference
 * - Ticket quantity
 * - Optional seating selection
 * - Pricing and currency metadata
 * - Reservation type
 *
 * @remarks
 * These schemas are intentionally lifecycle-agnostic.
 * Reservation ownership, status, expiration, and timestamps
 * are introduced by higher-level input schemas.
 */

import { z } from "zod";
import { ObjectIdSchema } from "../../../../shared/schema/mongoose/ObjectIdSchema.js";
import generateArraySchema from "../../../../shared/utility/schema/generateArraySchema.js";
import { PositiveNumberSchema } from "../../../../shared/schema/numbers/PositiveNumberSchema.js";
import { ISO4217CurrencyCodeEnumSchema } from "../../../../shared/schema/enums/ISO4217CurrencyCodeEnumSchema.js";
import { ReservationTypeEnumSchema } from "../enum/ReservationTypeEnumSchema.js";
import { ReservationTypeConstant } from "../../constants/ReservationTypeConstant.js";

/**
 * Base checkout submission schema.
 *
 * Provides shared structural validation for all reservation types
 * without enforcing reservation-type-specific seating rules.
 */
export const TicketCheckoutSubmitBaseSchema = z.object({
    /** Showing being reserved. */
    showing: ObjectIdSchema,

    /** Number of tickets included in the checkout. */
    ticketCount: PositiveNumberSchema,

    /** Currency used for pricing (ISO 4217). */
    currency: ISO4217CurrencyCodeEnumSchema,

    /** Reservation mode (general admission vs reserved seating). */
    reservationType: ReservationTypeEnumSchema,

    /**
     * Selected seating identifiers.
     *
     * @remarks
     * Presence and validity of this field are constrained by
     * reservation type via a discriminated union.
     */
    selectedSeating: generateArraySchema(ObjectIdSchema)
        .min(1, { message: "Must not be an empty array." })
        .optional()
        .nullable(),
});

/**
 * Checkout submission schema for general admission reservations.
 *
 * Explicitly forbids seating selection.
 */
const TicketCheckoutSubmitGeneralSchema =
    TicketCheckoutSubmitBaseSchema.extend({
        reservationType: z.literal(ReservationTypeConstant[0]),
        selectedSeating: z
            .union([z.null(), z.undefined()], {
                message: "Must be null or undefined.",
            })
            .optional(),
    });

/**
 * Checkout submission schema for reserved seating reservations.
 *
 * Requires one or more selected seat identifiers.
 */
const TicketCheckoutSubmitReservedSchema =
    TicketCheckoutSubmitBaseSchema.extend({
        reservationType: z.literal(ReservationTypeConstant[1]),
        selectedSeating: generateArraySchema(ObjectIdSchema).min(1, {
            message: "Must not be an empty array.",
        }),
    });

/**
 * Checkout submission schema with reservation-type-specific
 * seating constraints applied.
 *
 * Uses a discriminated union on `reservationType` to enforce
 * mutually exclusive input shapes at validation time.
 */
export const TicketCheckoutSubmitSchema = z.discriminatedUnion(
    "reservationType",
    [TicketCheckoutSubmitReservedSchema, TicketCheckoutSubmitGeneralSchema]
);

/**
 * Type representing a validated checkout submission payload.
 */
export type TicketCheckoutSubmitData =
    z.infer<typeof TicketCheckoutSubmitSchema>;
