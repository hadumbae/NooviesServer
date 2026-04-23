/**
 * @fileoverview Zod schema and type definition for theatre grid layout classifications.
 */

import {z} from "zod";
import {SeatLayoutTypeConstant} from "@domains/seat/validation/SeatLayoutTypeConstant";

/**
 * Zod enum schema for validating the layout classification of a grid cell.
 */
export const SeatLayoutTypeSchema = z.enum(
    SeatLayoutTypeConstant,
    {
        required_error: "Seat Layout is required.",
        invalid_type_error: `Must be: ${SeatLayoutTypeConstant.join(", ")}`,
    },
);

/**
 * TypeScript union type inferred from the SeatLayoutTypeSchema.
 * Represents the valid strings: "SEAT", "AISLE", or "STAIR".
 */
export type SeatLayoutType = z.infer<typeof SeatLayoutTypeSchema>;