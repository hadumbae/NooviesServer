import {z} from "zod";
import SeatTypeConstant from "../../constant/SeatTypeConstant.js";

/**
 * ## SeatTypeEnum
 *
 * Zod enum schema representing the allowed seat types within a theatre.
 * Ensures that all seat type values used in forms, models, or UI components
 * conform strictly to one of the predefined seat types defined in `SeatTypeConstant`.
 *
 * @remarks
 * The `message` option provides a user-friendly validation error when an
 * invalid seat type is submitted.
 *
 * @example
 * ```ts
 * import { SeatTypeEnum } from "@/schema/model/SeatType.schema.ts";
 *
 * const seatType = SeatTypeEnum.parse("VIP"); // ✅ Valid
 * const invalid = SeatTypeEnum.safeParse("RocketSeat"); // ❌ Fails
 * ```
 */
export const SeatTypeEnum = z.enum(SeatTypeConstant, {message: "Invalid Seat Type."});

/**
 * ## SeatType
 *
 * TypeScript union type inferred from `SeatTypeEnum`.
 * Represents all valid seat types in a theatre.
 *
 * @example
 * ```ts
 * const t: SeatType = "Recliner"; // ✅ OK
 * const x: SeatType = "RocketSeat"; // ❌ Type error
 * ```
 */
export type SeatType = z.infer<typeof SeatTypeEnum>;
