import {model, Model} from "mongoose";
import type {SeatSchemaFields} from "./Seat.types.js";
import {SeatSchema} from "./Seat.schema.js";

import "./Seat.middleware.js";

/**
 * Mongoose model representing a seat within a theatre.
 *
 * The `Seat` model is built from {@link SeatSchema} and typed with {@link SeatSchemaFields}.
 * It provides an interface to interact with seat documents in MongoDB,
 * including creation, querying, updates, and deletions.
 *
 * Each seat is uniquely identified by its combination of:
 * - `theatre`
 * - `screen`
 * - `row`
 * - `seatNumber`
 *
 * @example
 * ```ts
 * // Create a new seat
 * const seat = await Seat.create({
 *   theatre: someTheatreId,
 *   screen: someScreenId,
 *   row: "A",
 *   seatNumber: 5,
 *   seatType: "Regular",
 *   x: 1,
 *   y: 5,
 * });
 *
 * // Find all available VIP seats in a screen
 * const vipSeats = await Seat.find({
 *   screen: someScreenId,
 *   seatType: "VIP",
 *   isAvailable: true,
 * });
 * ```
 */
const Seat: Model<SeatSchemaFields> = model<SeatSchemaFields>("Seat", SeatSchema);

export default Seat;
