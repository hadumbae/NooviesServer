/**
 * @file Reservation.model.ts
 *
 * Mongoose model for the Reservation entity.
 *
 * Exposes a typed interface for interacting with reservation documents,
 * including creation, querying, updating, and deletion.
 *
 * The model composes:
 * - the reservation schema
 * - lifecycle and seating validation middleware
 * - a strongly typed document shape via {@link ReservationSchemaFields}
 *
 * Lifecycle rules, conditional dates, expiration handling, and seating
 * invariants are enforced at the schema and middleware levels.
 *
 * @example
 * ```ts
 * import Reservation from "@/pages/reservation/model/Reservation.model.js";
 *
 * const reservation = await Reservation.create({
 *   user: userId,
 *   showing: showingId,
 *   selectedSeating: [seatId1, seatId2],
 *   snapshot: snapshotData,
 *   ticketCount: 2,
 *   pricePaid: 100,
 *   currency: "USD",
 *   type: "RESERVED_SEATS",
 *   status: "RESERVED",
 *   dateReserved: new Date(),
 *   expiresAt: new Date(Date.now() + 30 * 60 * 1000),
 * });
 * ```
 */

import {type Model, model} from "mongoose";
import ReservationSchema from "./Reservation.schema.js";
import type {ReservationSchemaFields} from "./Reservation.types.js";
import {ReservationServiceProvider} from "../../providers/ReservationServiceProvider.js";
import "./Reservation.indexes.js";

ReservationServiceProvider.registerMiddleware();

/** Mongoose model for the `Reservation` collection. */
const Reservation: Model<ReservationSchemaFields> = model<ReservationSchemaFields>(
    "Reservation",
    ReservationSchema,
);

export default Reservation;
