/**
 * @file ReservationStatusEnum.schema.ts
 *
 * @description
 * Zod enum schema for validating reservation status values.
 *
 * Constrains reservation status fields to the supported lifecycle states
 * defined in `ReservationStatusConstant`, ensuring consistent validation and
 * error messaging across reservation and payment flows.
 */

import { z } from "zod";
import ReservationStatusConstant from "../../constants/ReservationStatusConstant.js";

/**
 * Reservation status validation schema.
 */
export const ReservationStatusEnumSchema = z.enum(
    ReservationStatusConstant,
    {
        required_error: "Required.",
        invalid_type_error: `Invalid value. Must be: ${ReservationStatusConstant.join(", ")}`,
    }
);

/**
 * Inferred reservation status type.
 */
export type ReservationStatus =
    z.infer<typeof ReservationStatusEnumSchema>;
