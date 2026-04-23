/**
 * ## SeatLayoutTypeConstant
 *
 * Provides the allowed layout classifications for a position within a theatre's
 * seating grid. This constant is used across form schemas, UI rendering logic,
 * and storage models to ensure that each grid cell is assigned a valid layout type.
 *
 * ### Layout Types
 * - **SEAT** — A standard seat that can be booked or displayed to users.
 * - **AISLE** — A non-seat spacing area that separates blocks of seats.
 * - **STAIR** — A vertical or horizontal passage section used for stepping between rows.
 *
 * @remarks
 * This constant is defined as a `readonly` tuple (`as const`) so TypeScript infers
 * a strict union type (`"SEAT" | "AISLE" | "STAIR"`).
 * It is commonly used in:
 * - Form validation
 * - Type-safe assignments in UI components
 * - Integration with Zod schemas, Mongoose models, and other database layers
 *
 * @example
 * ```ts
 * import SeatLayoutTypeConstant from "@/constant/SeatLayoutTypeConstant.ts";
 *
 * type LayoutType = typeof SeatLayoutTypeConstant[number];
 * // "SEAT" | "AISLE" | "STAIR"
 *
 * const seatLayout: LayoutType = "SEAT"; // ✅ Valid
 * const invalidLayout: LayoutType = "LOUNGE"; // ❌ Type error
 * ```
 */
const SeatLayoutTypeConstant = [
    "SEAT",
    "AISLE",
    "STAIR",
] as const;

export default SeatLayoutTypeConstant;
