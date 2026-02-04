/**
 * @file ReserveTicket.input.schema.ts
 *
 * Zod schema for validating reservation create and update payloads
 * at the API boundary.
 *
 * Extends checkout submission schemas with:
 * - Reservation ownership
 * - Lifecycle status
 * - Lifecycle timestamps
 * - Optional internal notes
 *
 * @remarks
 * This schema enforces structural and cross-field consistency only.
 * Business rules such as lifecycle transitions, expiration policies,
 * and state mutability are handled by service and model layers.
 */

import {z} from "zod";
import {ReservationStatusEnumSchema} from "../enum/ReservationStatusEnumSchema.js";
import {NonEmptyStringSchema} from "../../../../shared/schema/strings/NonEmptyStringSchema.js";
import {ReserveTicketSubmitSchema} from "./ReserveTicket.submit.schema.js";
import {DateInstanceSchema} from "../../../../shared/schema/date-time/DateInstanceSchema.js";
import {ObjectIdSchema} from "../../../../shared/schema/mongoose/ObjectIdSchema.js";
import {NonNegativeNumberSchema} from "../../../../shared/schema/numbers/NonNegativeNumberSchema.js";

/**
 * Reservation input schema with lifecycle metadata applied.
 *
 * Composes checkout submission validation with reservation-specific
 * fields required for persistence and lifecycle management.
 *
 * @remarks
 * Seating constraints remain enforced by the underlying
 * checkout submission discriminated union.
 */
export const ReserveTicketInputSchema =
    ReserveTicketSubmitSchema.and(
        z.object({
            /** User who owns the reservation. */
            user: ObjectIdSchema,

            /** Reservation expiration timestamp. */
            expiresAt: DateInstanceSchema,

            /** Timestamp when the reservation was created. */
            dateReserved: DateInstanceSchema,

            pricePaid: NonNegativeNumberSchema,

            /** Current lifecycle status of the reservation. */
            status: ReservationStatusEnumSchema,

            /** Optional internal notes for administrative use. */
            notes: NonEmptyStringSchema
                .max(3000, "Must be 3000 characters or less.")
                .optional(),
        })
    );

/**
 * Type representing a validated reservation input payload.
 */
export type ReserveTicketInputData =
    z.infer<typeof ReserveTicketInputSchema>;
