/**
 * @file TicketCheckoutInputSchema.ts
 *
 * Base Zod schema for validating ticket checkout input
 * prior to reservation lifecycle processing.
 *
 * Defines the minimal input required to initiate a reservation:
 * - Showing reference
 * - Ticket quantity
 * - Seating selection (if applicable)
 * - Pricing and currency metadata
 * - Reservation type
 *
 * @remarks
 * This schema is intentionally lifecycle-agnostic.
 * Reservation status, expiration, and lifecycle timestamps
 * are added and validated by higher-level schemas.
 */

import { z } from "zod";
import { ObjectIdSchema } from "../../../shared/schema/mongoose/ObjectIdSchema.js";
import generateArraySchema from "../../../shared/utility/schema/generateArraySchema.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { ISO4217CurrencyCodeEnumSchema } from "../../../shared/schema/enums/ISO4217CurrencyCodeEnumSchema.js";
import { ReservationTypeEnumSchema } from "./enum/ReservationTypeEnumSchema.js";
import { validateReservedSeating } from "../utilities/validation/validateReservedSeating.js";

/**
 * Base checkout input schema.
 */
export const TicketCheckoutInputBaseSchema = z.object({
    /** Showing being reserved. */
    showing: ObjectIdSchema,

    /** Number of tickets included in the checkout. */
    ticketCount: PositiveNumberSchema,

    /** Total price paid or payable. */
    pricePaid: PositiveNumberSchema,

    /** Currency used for pricing (ISO 4217). */
    currency: ISO4217CurrencyCodeEnumSchema,

    /** Reservation mode (general admission vs reserved seating). */
    type: ReservationTypeEnumSchema,

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
 * Checkout input schema with seating validation applied.
 */
export const TicketCheckoutInputSchema =
    TicketCheckoutInputBaseSchema.superRefine((values, ctx) => {
        const { type, selectedSeating } = values;
        validateReservedSeating(type, selectedSeating, ctx);
    });

/**
 * Type representing validated checkout input payload.
 */
export type TicketCheckoutInputData = z.infer<typeof TicketCheckoutInputSchema>;
