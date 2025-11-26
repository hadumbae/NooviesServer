import {z} from "zod";
import SeatMapStatusConstant from "../../constants/SeatMapStatusConstant.js";

/**
 * Zod enum schema representing all valid seat map statuses.
 *
 * @remarks
 * This schema is generated directly from {@link SeatMapStatusConstant},
 * ensuring strict alignment between the runtime values and the validated type.
 * Custom error messages are included for missing or invalid values.
 *
 * **Valid values:** `UNAVAILABLE`, `AVAILABLE`, `RESERVED`, `SOLD`
 */
export const SeatMapStatusEnumSchema = z.enum(
    SeatMapStatusConstant,
    {
        required_error: "Required.",
        invalid_type_error: `Invalid value. Must be: ${SeatMapStatusConstant.join(", ")}`,
    },
);

/**
 * Type representing a valid seat map status.
 *
 * @remarks
 * This is inferred directly from {@link SeatMapStatusEnumSchema}, keeping
 * runtime and compile-time definitions in sync.
 */
export type SeatMapStatus = z.infer<typeof SeatMapStatusEnumSchema>;
