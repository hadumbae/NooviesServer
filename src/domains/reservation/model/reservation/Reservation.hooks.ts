/**
 * @file registerReservationHooks.ts
 *
 * Registers schema-level lifecycle hooks for the Reservation model.
 *
 * Attaches validation and invariant enforcement related to:
 * - Reservation status transitions
 * - Required lifecycle timestamps
 * - Expiration rules
 * - Seating constraints
 *
 * Intended to be called once during application bootstrap
 * before the Reservation model is used.
 */

import { ReservationLifecycleService } from "../../services/lifecycle/ReservationLifecycleService.js";
import ReservationSchema from "./Reservation.schema.js";

/**
 * Register all Reservation schema hooks.
 *
 * @remarks
 * Delegates lifecycle validation logic to {@link ReservationLifecycleService}
 * and binds it to the Reservation schema.
 */
export const registerReservationHooks = (): void => {
    const lifecycleService = new ReservationLifecycleService();
    lifecycleService.registerHooks(ReservationSchema);
};
