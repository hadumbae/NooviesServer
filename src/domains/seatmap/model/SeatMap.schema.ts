/**
 * @file SeatMapSchema
 * @description
 * Defines the Mongoose schema for mapping seats to specific movie showings.
 * Each document represents a single seat within a specific showing and stores its
 * status, optional overridden price, and indexing constraints.
 *
 * This schema serves as a join-table between the `Showing` and `Seat` models,
 * enforcing uniqueness of `(showing, seat)` pairs while tracking the lifecycle
 * of each seat (available, reserved, sold, unavailable).
 *
 * @example
 * ```ts
 * import SeatMapModel from "@/models/SeatMap";
 *
 * // Query all available seats for a showing
 * const seats = await SeatMapModel.find({
 *   showing: showingId,
 *   status: "AVAILABLE",
 * });
 * ```
 */

import {Schema} from "mongoose";
import type ISeatMap from "./SeatMap.interface.js";
import SeatMapStatusConstant from "../constants/SeatMapStatusConstant.js";

/**
 * SeatMapSchema
 *
 * @description
 * A schema that defines the association between a `Showing` and a `Seat`.
 * Also tracks the price (if overridden) and current seat status.
 */
export const SeatMapSchema = new Schema<ISeatMap>({
    /**
     * @property showing
     * @description
     * Reference to the movie showing this seat belongs to.
     *
     * @type ObjectId (ref: Showing)
     * @required
     */
    showing: {
        type: Schema.Types.ObjectId,
        ref: "Showing",
        required: [true, "Showing is required."],
    },

    /**
     * @property seat
     * @description
     * Reference to a seat within the theatre layout.
     *
     * @type ObjectId (ref: Seat)
     * @required
     */
    seat: {
        type: Schema.Types.ObjectId,
        ref: "Seat",
        required: [true, "Seat is required."],
    },

    /**
     * @property price
     * @description
     * Optional seat-specific price override.
     * If omitted, the system should fall back to `Showing.ticketPrice`.
     *
     * @type number
     * @minimum 0
     * @optional
     */
    price: {
        type: Number,
        min: [0, "Price must be greater than 0."],
    },

    /**
     * @property status
     * @description
     * Current status of the seat within this showing.
     *
     * Allowed values are defined by `SeatMapStatusConstant`, e.g.:
     * - `AVAILABLE`
     * - `RESERVED`
     * - `SOLD`
     * - `UNAVAILABLE`
     *
     * @default AVAILABLE
     * @required
     */
    status: {
        type: String,
        enum: {
            values: SeatMapStatusConstant,
            message: `Invalid Seat Map Status. Must be: ${SeatMapStatusConstant.join(", ")}`
        },
        required: [true, "Status is required."],
        default: "AVAILABLE",
    },
});

/**
 * Enforces uniqueness: a single seat cannot appear more than once
 * in the same showing.
 */
SeatMapSchema.index({showing: 1, seat: 1}, {unique: true});

/**
 * Optimizes queries for seat availability by showing and status.
 */
SeatMapSchema.index({showing: 1, status: 1});
