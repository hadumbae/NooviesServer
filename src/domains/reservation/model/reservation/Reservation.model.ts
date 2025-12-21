/**
 * @file Reservation.model.ts
 *
 * @description
 * Mongoose model for the Reservation entity.
 *
 * Provides a typed interface (`ReservationSchemaFields`) to interact with
 * reservations in MongoDB, including creation, querying, updating, and
 * deletion. Integrates the immutable showing snapshot, user references,
 * seating selections, and lifecycle status with conditional dates.
 *
 * Usage example:
 * ```ts
 * import Reservation from "@/pages/reservation/model/Reservation.model.js";
 *
 * // Create a new reservation
 * const newReservation = await Reservation.create({
 *   user: userId,
 *   showing: showingId,
 *   selectedSeating: [seatId1, seatId2],
 *   snapshot: snapshotData,
 *   pricePaid: 100,
 *   currency: "USD",
 *   status: "RESERVED",
 *   dateReserved: new Date(),
 *   expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
 * });
 * ```
 */

import { type Model, model } from "mongoose";
import ReservationSchema from "./Reservation.schema.js";
import type { ReservationSchemaFields } from "./Reservation.types.js";

/** Mongoose model for the Reservation collection. */
const Reservation: Model<ReservationSchemaFields> = model<ReservationSchemaFields>(
    "Reservation",
    ReservationSchema
);

export default Reservation;
