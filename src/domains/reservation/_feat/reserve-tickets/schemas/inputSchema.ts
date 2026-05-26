/**
 * @fileoverview Zod validation schemas and types for ticket reservation input.
 */

import {z} from "zod";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";
import generateArraySchema from "@shared/utility/schema/generateArraySchema";
import {PositiveNumberSchema} from "@shared/schema/numbers/PositiveNumberSchema";
import {ISO4217CurrencyCodeEnumSchema} from "@shared/schema/enums/ISO4217CurrencyCodeEnumSchema";
import {ReservationTypeConstant} from "@domains/reservation/constants";
import {ReservationTypeEnumSchema} from "@domains/reservation/validation/enums";

/** Base checkout submission schema providing shared structural validation. */
export const ReserveTicketInputBaseSchema = z.object({
    showing: ObjectIdSchema,
    ticketCount: PositiveNumberSchema,
    currency: ISO4217CurrencyCodeEnumSchema,
    reservationType: ReservationTypeEnumSchema,
    selectedSeating: generateArraySchema(ObjectIdSchema)
        .min(1, {message: "Must not be an empty array."})
        .optional()
        .nullable(),
});

/**
 * Validation schema for 'GENERAL_ADMISSION' reservations.
 */
const SubmitGeneralSchema =
    ReserveTicketInputBaseSchema.extend({
        reservationType: z.literal(ReservationTypeConstant[0]),
        selectedSeating: z
            .union([z.null(), z.undefined()], {
                message: "Must be null or undefined.",
            })
            .optional(),
    });

/**
 * Validation schema for 'RESERVED_SEATS' reservations.
 */
const SubmitReservedSchema =
    ReserveTicketInputBaseSchema.extend({
        reservationType: z.literal(ReservationTypeConstant[1]),
        selectedSeating: generateArraySchema(ObjectIdSchema).min(1, {
            message: "Must not be an empty array.",
        }),
    });

/** Final checkout submission schema utilizing a discriminated union. */
export const ReserveTicketInputSchema = z.discriminatedUnion(
    "reservationType",
    [SubmitReservedSchema, SubmitGeneralSchema]
);

/** TypeScript type inferred from ReserveTicketInputSchema. */
export type ReserveTicketInputData =
    z.infer<typeof ReserveTicketInputSchema>;