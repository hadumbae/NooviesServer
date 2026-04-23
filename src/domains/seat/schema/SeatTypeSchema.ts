/**
 * @fileoverview Zod schema and type definition for theatre seat categories.
 */

import {z} from "zod";
import {SeatTypeConstant} from "@domains/seat/schema/SeatTypeConstant";

/**
 * Zod enum schema for validating a seat's category against the predefined constant list.
 */
export const SeatTypeSchema = z.enum(SeatTypeConstant, {
    message: "Invalid Seat Type.",
});

/**
 * TypeScript union type inferred from SeatTypeSchema.
 */
export type SeatType = z.infer<typeof SeatTypeSchema>;