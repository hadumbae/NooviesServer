/**
 * @file Zod validation schemas and types for ticket reservation input.
 * @filename inputSchema.ts
 */

import {z} from "zod";
import {ObjectIdSchema} from "@shared/schema/mongoose/ObjectIdSchema";
import generateArraySchema from "@shared/utility/schema/generateArraySchema";
import {PositiveNumberSchema} from "@shared/schema/numbers/PositiveNumberSchema";
import {ISO4217CurrencyCodeEnumSchema} from "@shared/schema/enums/ISO4217CurrencyCodeEnumSchema";
import {ReservationTypeEnumSchema} from "../../../schemas/enum/ReservationTypeEnumSchema";
import {ReservationTypeConstant} from "../../../constants/ReservationTypeConstant";

/**
 * Base checkout submission schema providing shared structural validation.
 */
export const ReserveTicketInputBaseSchema = z.object({
    /** The specific event showing being booked. */
    showing: ObjectIdSchema,

    /** Total quantity of tickets in the request. */
    ticketCount: PositiveNumberSchema,

    /** The currency context for pricing calculations. */
    currency: ISO4217CurrencyCodeEnumSchema,

    /** Identifies if the booking follows GA or Reserved Seating rules. */
    reservationType: ReservationTypeEnumSchema,

    /**
     * Optional collection of seat identifiers.
     * Logic for requirement vs. exclusion is handled in {@link ReserveTicketInputSchema}.
     */
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

/**
 * Final checkout submission schema utilizing a discriminated union.
 */
export const ReserveTicketInputSchema = z.discriminatedUnion(
    "reservationType",
    [SubmitReservedSchema, SubmitGeneralSchema]
);

/**
 * TypeScript type inferred from {@link ReserveTicketInputSchema}.
 */
export type ReserveTicketInputData =
    z.infer<typeof ReserveTicketInputSchema>;