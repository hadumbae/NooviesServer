/**
 * @file ReservationInputSchema.ts
 *
 * Zod schema for validating reservation create and update requests.
 *
 * Defines the API-facing shape of a reservation, including:
 * - Ownership and showing references
 * - Seating selection and reservation type
 * - Pricing and currency metadata
 * - Lifecycle status and associated timestamps
 * - Optional internal notes
 *
 * Includes cross-field validation to enforce:
 * - Required lifecycle dates based on {@link ReservationStatus}
 * - Seating constraints based on {@link ReservationTypeEnumSchema}
 * - Structural consistency prior to persistence
 *
 * Intended strictly for API boundary validation.
 */

import { z } from "zod";
import { ObjectIdSchema } from "../../../shared/schema/mongoose/ObjectIdSchema.js";
import generateArraySchema from "../../../shared/utility/schema/generateArraySchema.js";
import { PositiveNumberSchema } from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import { ISO4217CurrencyCodeEnumSchema } from "../../../shared/schema/enums/ISO4217CurrencyCodeEnumSchema.js";
import {
    type ReservationStatus,
    ReservationStatusEnumSchema,
} from "./enum/ReservationStatusEnumSchema.js";
import { NonEmptyStringSchema } from "../../../shared/schema/strings/NonEmptyStringSchema.js";
import { UTCDateOnlySchema } from "../../../shared/schema/date-time/UTCDateOnlySchema.js";
import { ReservationTypeEnumSchema } from "./enum/ReservationTypeEnumSchema.js";

/**
 * Internal mapping of reservation status → required lifecycle date.
 *
 * Used exclusively for cross-field validation.
 */
type DateMapValue = {
    path: "datePaid" | "dateCancelled" | "dateRefunded" | "dateExpired";
    message: string;
};

/**
 * Status-specific required date definitions.
 */
const DATE_MAP: Partial<Record<ReservationStatus, DateMapValue>> = {
    PAID: {
        path: "datePaid",
        message: "Date Paid required for paid reservations.",
    },
    CANCELLED: {
        path: "dateCancelled",
        message: "Date Cancelled required for cancelled reservations.",
    },
    REFUNDED: {
        path: "dateRefunded",
        message: "Date Refunded required for refunded reservations.",
    },
    EXPIRED: {
        path: "dateExpired",
        message: "Date Expired required for expired reservations.",
    },
};

/**
 * Reservation input validation schema.
 *
 * @remarks
 * This schema performs structural validation only.
 * Business rules such as expiration timing and lifecycle
 * transitions are enforced at the model layer.
 */
export const ReservationInputSchema = z
    .object({
        /** User who owns the reservation. */
        user: ObjectIdSchema,

        /** Showing being reserved. */
        showing: ObjectIdSchema,

        /** Number of tickets included in the reservation. */
        ticketCount: PositiveNumberSchema,

        /**
         * Selected seating identifiers.
         *
         * @remarks
         * - Required and non-empty for reserved seating
         * - Must be absent for general admission
         */
        selectedSeating: generateArraySchema(ObjectIdSchema)
            .min(1, { message: "Must not be an empty array." })
            .optional()
            .nullable(),

        /** Total price paid or payable for the reservation. */
        pricePaid: PositiveNumberSchema,

        /** Currency used for the reservation price (ISO 4217). */
        currency: ISO4217CurrencyCodeEnumSchema,

        /** Date the reservation was created. */
        dateReserved: UTCDateOnlySchema,

        /** Date the reservation was paid. */
        datePaid: UTCDateOnlySchema.optional(),

        /** Date the reservation was cancelled. */
        dateCancelled: UTCDateOnlySchema.optional(),

        /** Date the reservation was refunded. */
        dateRefunded: UTCDateOnlySchema.optional(),

        /** Date the reservation expired. */
        dateExpired: UTCDateOnlySchema.optional(),

        /**
         * Expiration timestamp for unpaid reservations.
         *
         * @remarks
         * Required for active reservations and validated
         * further at the schema level.
         */
        expiresAt: UTCDateOnlySchema,

        /** Current lifecycle status of the reservation. */
        status: ReservationStatusEnumSchema,

        /** Reservation mode (general admission vs reserved seating). */
        type: ReservationTypeEnumSchema,

        /**
         * Optional internal notes or operational context.
         */
        notes: NonEmptyStringSchema
            .max(3000, "Must be 3000 characters or less.")
            .optional(),
    })
    .superRefine((values, ctx) => {
        const { status, type, selectedSeating } = values;

        // --- REQUIRED STATUS DATES ---

        const { path: reqDate, message: reqMessage } = DATE_MAP[status] ?? {};

        if (reqDate && !values[reqDate]) {
            ctx.addIssue({
                code: "invalid_date",
                path: [reqDate],
                message: reqMessage,
            });
        }

        // --- GENERAL ADMISSION ---

        if (type === "GENERAL_ADMISSION" && Array.isArray(selectedSeating)) {
            ctx.addIssue({
                code: "invalid_type",
                path: ["selectedSeating"],
                expected: "null",
                received: typeof selectedSeating,
                message: "Must be empty for general admission.",
            });
        }

        // --- RESERVED SEATS ---

        if (type === "RESERVED_SEATS" && !Array.isArray(selectedSeating)) {
            ctx.addIssue({
                code: "invalid_type",
                path: ["selectedSeating"],
                expected: "array",
                received: typeof selectedSeating,
                message: "Required for reserved seating.",
            });
        }
    });

/**
 * Type representing validated reservation input data.
 */
export type ReservationInputData = z.infer<typeof ReservationInputSchema>;
