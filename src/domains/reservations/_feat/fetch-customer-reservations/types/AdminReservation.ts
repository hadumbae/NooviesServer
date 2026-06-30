/**
 * @fileoverview Specialized reservation type for the administrative dashboard with populated user data.
 */

import type {AdminReservationUser} from "./AdminReservationUser";
import type {ReservationSchemaFields} from "@/domains/reservations/_model/reservation";

/** Reservation entity with a populated administrative user projection. */
export type AdminReservation = Omit<ReservationSchemaFields, "user"> & {
    user: AdminReservationUser;
};