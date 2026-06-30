/**
 * @fileoverview Zod schema for validating reservation persistence and lifecycle metadata.
 */

import {z} from "zod";
import {NonEmptyStringSchema} from "@/shared/schema/strings/NonEmptyStringSchema";
import {ReserveTicketInputSchema} from "@/domains/reservations/_feat/reserve-tickets/schemas";
import {DateInstanceSchema} from "@/shared/schema/date-time/DateInstanceSchema";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";
import {NonNegativeNumberSchema} from "@/shared/schema/numbers/NonNegativeNumberSchema";
import {ReservationStatusSchema} from "@/domains/reservations/_validation";

/** Validation schema for the internal persistence layer of a ticket reservation. */
export const ReserveTicketPersistenceSchema =
    ReserveTicketInputSchema.and(
        z.object({
            user: ObjectIdSchema,
            expiresAt: DateInstanceSchema,
            dateReserved: DateInstanceSchema,
            pricePaid: NonNegativeNumberSchema,
            status: ReservationStatusSchema,
            notes: NonEmptyStringSchema
                .max(3000, "Must be 3000 characters or less.")
                .optional(),
        })
    );

/** TypeScript type inferred from ReserveTicketPersistenceSchema. */
export type ReserveTicketPersistenceData =
    z.infer<typeof ReserveTicketPersistenceSchema>;