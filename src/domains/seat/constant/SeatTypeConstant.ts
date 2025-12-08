/**
 * ## SeatTypeConstant
 *
 * Provides the complete list of predefined seat classifications for a theatre.
 * Each type represents a category of seating that may differ in comfort, pricing,
 * accessibility, or special features.
 *
 * ### Seat Types
 * - **REGULAR** — Standard theatre seat.
 * - **PREMIUM** — Enhanced comfort or better location.
 * - **VIP** — Exclusive, high-end seating.
 * - **RECLINER** — Fully or partially reclining seat.
 * - **LOVESEAT** — Two-person seat for couples.
 * - **ACCESSIBLE** — Designed for wheelchair users or mobility-impaired patrons.
 * - **COMPANION** — Adjacent to accessible seats for a companion.
 * - **D-BOX** — Motion-enabled seats for immersive experience.
 * - **HAPTIC** — Seats with vibration feedback for immersion.
 * - **EXTRA-LEGROOM** — Seats with additional leg space.
 * - **BALCONY** — Elevated seating.
 * - **CUDDLE COUCH** — Comfortable sofa-like seating for two or more.
 * - **POD** — Enclosed or semi-enclosed seating pod.
 * - **BOX** — Private or semi-private box seating.
 * - **BEAN BAG** — Casual, flexible seating on the floor.
 * - **FLOOR** — Standard floor seating (general admission).
 * - **BUDGET** — Affordable, no-frills seating.
 * - **STANDING SPACE** — Open area for standing.
 *
 * @remarks
 * This constant is defined as a `readonly` tuple (`as const`) so TypeScript infers
 * a strict union type. It is intended for use in:
 * - Form validation
 * - Type-safe assignments in UI components
 * - Integration with Zod schemas, Mongoose models, and other database layers
 *
 * @example
 * ```ts
 * import SeatTypeConstant from "@/constant/SeatTypeConstant.ts";
 *
 * type SeatType = typeof SeatTypeConstant[number];
 * // "REGULAR" | "PREMIUM" | "VIP" | ... | "STANDING SPACE"
 *
 * // Example usage in a seat object
 * const seat = {
 *   seatType: "VIP" as SeatType,
 *   layoutType: "Seat",
 *   row: "A",
 *   seatNumber: 1,
 * };
 * ```
 */
export default [
    "REGULAR",
    "PREMIUM",
    "VIP",
    "RECLINER",
    "LOVESEAT",
    "ACCESSIBLE",
    "COMPANION",
    "D-BOX",
    "HAPTIC",
    "EXTRA-LEGROOM",
    "BALCONY",
    "CUDDLE COUCH",
    "POD",
    "BOX",
    "BEAN BAG",
    "FLOOR",
    "BUDGET",
    "STANDING SPACE",
] as const;
