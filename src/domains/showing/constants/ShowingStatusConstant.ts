/**
 * @fileoverview
 * Defines the allowed status values for a `Showing`.
 *
 * @description
 * This constant array represents all possible states a movie showing
 * can have within the system. It is declared as `readonly` (`as const`)
 * so that TypeScript treats each element as a literal type.
 *
 * ### Allowed Statuses
 * - `"SCHEDULED"` — Showing is planned and upcoming.
 * - `"RUNNING"` — Showing is currently in progress.
 * - `"COMPLETED"` — Showing has finished.
 * - `"CANCELLED"` — Showing has been cancelled.
 * - `"SOLD_OUT"` — All seats for the showing have been sold.
 *
 * @example
 * ```ts
 * import ShowingStatusConstant from "./ShowingStatus.constant.js";
 *
 * function updateStatus(status: typeof ShowingStatusConstant[number]) {
 *   // status must be one of the allowed ShowingStatusConstant values
 * }
 * ```
 */
const ShowingStatusConstant = [
    "SCHEDULED",
    "RUNNING",
    "COMPLETED",
    "CANCELLED",
    "SOLD_OUT"
] as const;

export default ShowingStatusConstant;
