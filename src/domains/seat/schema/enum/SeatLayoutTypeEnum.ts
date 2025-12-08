import {z} from "zod";
import SeatLayoutTypeConstant from "../../constant/SeatLayoutTypeConstant.js";

/**
 * ## SeatLayoutTypeEnum
 *
 * Zod enum schema representing the allowed layout classifications for a cell
 * within the theatre’s seating grid. This ensures that every stored or submitted
 * value for a seat layout conforms strictly to one of the valid layout types
 * defined in `SeatLayoutTypeConstant`.
 *
 * The enum helps enforce:
 * - Form validation for seat-map editing UIs.
 * - Backend validation for creation and updates.
 * - Type-safe inference for the `SeatLayoutType` union type.
 *
 * @remarks
 * The error messages are customized to provide clearer guidance to end-users
 * when they submit an invalid or missing layout type.
 *
 * @example
 * ```ts
 * // Parsing form input
 * const layout = SeatLayoutTypeEnum.parse("Seat");
 *
 * // Inferring the TypeScript type
 * type MyLayoutType = SeatLayoutType; // "Seat" | "Aisle" | "Stair"
 * ```
 */
export const SeatLayoutTypeEnum = z.enum(
    SeatLayoutTypeConstant,
    {
        required_error: "Seat Layout is required.",
        invalid_type_error: `Must be: ${SeatLayoutTypeConstant.join(", ")}`,
    },
);

/**
 * ## SeatLayoutType
 *
 * TypeScript union type inferred from `SeatLayoutTypeEnum`.
 * Represents all valid seat layout classifications within the theatre grid.
 *
 * @example
 * ```ts
 * const t: SeatLayoutType = "Aisle"; // OK
 * const x: SeatLayoutType = "Door";  // ❌ Type error
 * ```
 */
export type SeatLayoutType = z.infer<typeof SeatLayoutTypeEnum>;
