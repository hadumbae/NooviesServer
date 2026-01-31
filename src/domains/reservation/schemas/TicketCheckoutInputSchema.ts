/**
 * @file TicketCheckoutInputSchema.ts
 *
 * Zod schema for validating reservation create and update requests
 * at the API boundary.
 *
 * Extends the base checkout submission schema with:
 * - Reservation ownership
 * - Lifecycle status
 * - Status-dependent lifecycle timestamps
 * - Optional internal notes
 *
 * Performs cross-field validation to enforce:
 * - Seating constraints based on reservation type
 *
 * @remarks
 * This schema is limited to structural and consistency validation.
 * Business rules such as lifecycle transitions, expiration timing,
 * and state enforcement are handled at the service and model layers.
 */

import { z } from "zod";
import {
    ReservationStatusEnumSchema,
} from "./enum/ReservationStatusEnumSchema.js";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import { validateReservedSeating } from "../utilities/validation/validateReservedSeating.js";
import { TicketCheckoutSubmitBaseSchema } from "./TicketCheckoutSubmitSchema.js";
import { DateInstanceSchema } from "../../../shared/schema/date-time/DateInstanceSchema.js";
import { ObjectIdSchema } from "../../../shared/schema/mongoose/ObjectIdSchema.js";

/**
 * Base reservation input schema including lifecycle metadata.
 */
export const TicketCheckoutInputBaseSchema =
    TicketCheckoutSubmitBaseSchema.extend({
        /** User owning the reservation. */
        user: ObjectIdSchema,

        /** Reservation expiration timestamp. */
        expiresAt: DateInstanceSchema,

        /** Timestamp when the reservation was created. */
        dateReserved: DateInstanceSchema,

        /** Current reservation lifecycle status. */
        status: ReservationStatusEnumSchema,

        /** Optional internal notes associated with the reservation. */
        notes: NonEmptyStringSchema
            .max(3000, "Must be 3000 characters or less.")
            .optional(),
    });

/**
 * Reservation input schema with cross-field validation applied.
 *
 * Enforces seating rules based on reservation type.
 */
export const TicketCheckoutInputSchema =
    TicketCheckoutInputBaseSchema.superRefine((values, ctx) => {
        const { reservationType, selectedSeating } = values;
        validateReservedSeating(reservationType, selectedSeating, ctx);
    });

/**
 * Type representing validated reservation input payload.
 */
export type TicketCheckoutInputData =
    z.infer<typeof TicketCheckoutInputSchema>;
