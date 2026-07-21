/**
 * @fileoverview Defines the Zod validation schema and type for seat map status values.
 */

import {z} from "zod";
import {SeatMapStatusConstant} from "@/domains/seatmap/_validation/fields/SeatMapStatusConstant";
import {ZodEnumParamHandler} from "@/shared/_feat";

/** Zod schema for validating seat map status strings against allowed constants. */
export const SeatMapStatusSchema = z.enum(SeatMapStatusConstant, ZodEnumParamHandler({
    invalidValue: `Invalid value. Must be: ${SeatMapStatusConstant.join(", ")}`,
    invalidType: "Must be a valid Seat Map Status string value."
}));

/** Type inferred from the SeatMapStatusSchema. */
export type SeatMapStatus = z.infer<typeof SeatMapStatusSchema>;
