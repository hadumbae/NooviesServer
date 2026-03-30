/**
 * @file Zod schema for validating reservation persistence and lifecycle metadata.
 * @filename persistenceSchema.ts
 */

import {z} from "zod";
import {ReservationStatusEnumSchema} from "../../../schemas/enum/ReservationStatusEnumSchema";
import {NonEmptyStringSchema} from "@shared/schema/strings/NonEmptyStringSchema";
import {ReserveTicketInputSchema} from "./inputSchema";
import {DateInstanceSchema} from "@shared/schema/date-time/DateInstanceSchema";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";
import {NonNegativeNumberSchema} from "@shared/schema/numbers/NonNegativeNumberSchema";

/**
 * Validation schema for the internal persistence layer of a ticket reservation.
 */
export const ReserveTicketPersistenceSchema =
    ReserveTicketInputSchema.and(
        z.object({
            /** Reference to the User who owns the reservation. */
            user: ObjectIdSchema,

            /** The calculated deadline for payment before inventory release. */
            expiresAt: DateInstanceSchema,

            /** The authoritative timestamp of when the hold was initiated. */
            dateReserved: DateInstanceSchema,

            /** The calculated total price for the transaction at the time of reservation. */
            pricePaid: NonNegativeNumberSchema,

            /** The initial lifecycle state (typically 'RESERVED'). */
            status: ReservationStatusEnumSchema,

            /**
             * Administrative or system-generated notes.
             * Constrained to 3000 characters to prevent database bloat.
             */
            notes: NonEmptyStringSchema
                .max(3000, "Must be 3000 characters or less.")
                .optional(),
        })
    );

/**
 * TypeScript type inferred from {@link ReserveTicketPersistenceSchema}.
 */
export type ReserveTicketPersistenceData =
    z.infer<typeof ReserveTicketPersistenceSchema>;