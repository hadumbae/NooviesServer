/**
 * @file Specialized TypeScript type for representing a Reservation in the Administrative Dashboard.
 * @filename AdminReservation.ts
 */


import type {ReservationSchemaFields} from "@domains/reservation/model/reservation/Reservation.types";
import type {AdminReservationUser} from "@domains/reservation/features/fetch-reservations/admin";

/**
 * A refined representation of the Reservation entity with a populated User projection.
 */
export type AdminReservation = Omit<ReservationSchemaFields, "user"> & {
    /** The narrowed user identity associated with this reservation. */
    user: AdminReservationUser;
};