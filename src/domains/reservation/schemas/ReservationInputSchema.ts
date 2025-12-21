/**
 * @file ReservationInputSchema.ts
 *
 * @description
 * Zod schema for validating input when creating or updating a reservation.
 *
 * Defines all core reservation fields, including references to the user and
 * showing, selected seating, pricing and currency information, lifecycle dates,
 * current reservation status, and optional internal notes.
 *
 * Includes cross-field validation to enforce:
 * - Required lifecycle dates based on reservation status
 * - Future-only expiration timestamps for active reservations
 *
 * Intended for API boundary validation to ensure consistent, well-formed
 * reservation data prior to persistence.
 */

import { z } from "zod";
import { ObjectIdSchema } from "../../../shared/schema/mongoose/ObjectIdSchema.js";
import generateArraySchema from "../../../shared/utility/schema/generateArraySchema.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { ISO4217CurrencyCodeEnumSchema } from "../../../shared/schema/enums/ISO4217CurrencyCodeEnumSchema.js";
import { ReservationStatusEnumSchema } from "./enum/ReservationStatusEnumSchema.js";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import { DateTime } from "luxon";
import { UTCDateOnlySchema } from "../../../shared/schema/date-time/UTCDateOnlySchema.js";

/** Reservation input schema. */
export const ReservationInputSchema = z.object({
    /** User who owns the reservation. */
    user: ObjectIdSchema,

    /** Showing being reserved. */
    showing: ObjectIdSchema,

    /** Selected seating identifiers for the reservation. Must be non-empty. */
    selectedSeating: generateArraySchema(ObjectIdSchema),

    /** Total price paid or payable for the reservation. */
    pricePaid: PositiveNumberSchema,

    /** Currency used for the reservation price (ISO 4217). */
    currency: ISO4217CurrencyCodeEnumSchema,

    /** Date the reservation was created. */
    dateReserved: UTCDateOnlySchema,

    /** Date the reservation was paid (required if status is PAID). */
    datePaid: UTCDateOnlySchema.optional(),

    /** Date the reservation was cancelled (required if status is CANCELLED). */
    dateCancelled: UTCDateOnlySchema.optional(),

    /** Date the reservation was refunded (required if status is REFUNDED). */
    dateRefunded: UTCDateOnlySchema.optional(),

    /** Date the reservation expired (required if status is EXPIRED). */
    dateExpired: UTCDateOnlySchema.optional(),

    /**
     * Expiration date for unpaid reservations.
     * Must be in the future when provided.
     */
    expiresAt: UTCDateOnlySchema.optional(),

    /** Current lifecycle status of the reservation. */
    status: ReservationStatusEnumSchema,

    /** Optional internal notes or remarks associated with the reservation. */
    notes: NonEmptyStringSchema
        .max(3000, "Must be 3000 characters or less.")
        .optional(),
}).superRefine((values, ctx) => {
    const {
        status,
        datePaid,
        dateCancelled,
        dateRefunded,
        dateExpired,
        expiresAt,
    } = values;

    if (status === "PAID" && !datePaid) {
        ctx.addIssue({
            code: "invalid_date",
            path: ["datePaid"],
            message: "Date Paid required for paid reservations.",
        });
    }

    if (status === "CANCELLED" && !dateCancelled) {
        ctx.addIssue({
            code: "invalid_date",
            path: ["dateCancelled"],
            message: "Date Cancelled required for cancelled reservations.",
        });
    }

    if (status === "REFUNDED" && !dateRefunded) {
        ctx.addIssue({
            code: "invalid_date",
            path: ["dateRefunded"],
            message: "Date Refunded required for refunded reservations.",
        });
    }

    if (status === "EXPIRED" && !dateExpired) {
        ctx.addIssue({
            code: "invalid_date",
            path: ["dateExpired"],
            message: "Date Expired required for expired reservations.",
        });
    }

    if (expiresAt) {
        const now = DateTime.utc();
        const checkDate = DateTime.fromJSDate(expiresAt).toUTC();

        if (now >= checkDate) {
            ctx.addIssue({
                code: "invalid_date",
                path: ["expiresAt"],
                message: "Expiry date cannot be in the past.",
            });
        }
    }
});

/** Type representing validated reservation input data. */
export type ReservationInputData = z.infer<typeof ReservationInputSchema>;
