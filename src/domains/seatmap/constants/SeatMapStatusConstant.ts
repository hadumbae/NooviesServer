/**
 * A read-only list of all possible seat map statuses used in the system.
 *
 * These values represent the availability state of a seat within any
 * seating layout or reservation flow.
 *
 * @remarks
 * Exported as a `readonly` tuple via `as const`, so consumers can use it
 * for strict type inference or create a union type using:
 * `type SeatMapStatus = typeof SeatMapStatusConstant[number];`
 */
const SeatMapStatusConstant = [
    "UNAVAILABLE",
    "AVAILABLE",
    "RESERVED",
    "SOLD",
] as const;

export default SeatMapStatusConstant;
