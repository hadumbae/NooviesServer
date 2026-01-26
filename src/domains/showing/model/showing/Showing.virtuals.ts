import { ShowingSchema } from "./Showing.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * @fileoverview
 * Declares virtual population fields for the `Showing` schema.
 *
 * @description
 * These virtuals expose **computed seat statistics** derived from the
 * related `SeatMap` documents without duplicating data.
 *
 * Each virtual field leverages Mongoose’s virtual population mechanism
 * combined with the `count: true` option to return only the number of
 * matching documents, ensuring efficient aggregation.
 *
 * ---
 * ### Virtual Field Summary
 * | Virtual Name | Description | Match Filter |
 * |---------------|--------------|--------------|
 * | `seatMapCount` | Total number of seat maps linked to this showing. | — |
 * | `availableSeatsCount` | Seats currently marked as available. | `{ isAvailable: true }` |
 * | `reservedSeatsCount` | Seats that have been reserved. | `{ isReserved: true }` |
 * | `unreservedSeatsCount` | Seats that are available and not reserved. | `{ isAvailable: true, isReserved: false }` |
 *
 * ---
 * @example
 * ```ts
 * // Populate virtual counts in a lean query:
 * const showings = await Showing.find().lean({ virtuals: true });
 * console.log(showings[0].availableSeatsCount); // → 42
 * ```
 */

/**
 * Virtual field representing the total number of seat map entries
 * associated with this showing.
 *
 * @remarks
 * Uses Mongoose virtual population with `count: true` for efficient counting.
 * This field reflects the total number of seat map documents linked by `showing`.
 *
 * @see SeatMap
 */
ShowingSchema.virtual("seatMapCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    count: true,
});

/**
 * Virtual field representing the number of seats currently available.
 *
 * @remarks
 * Filters related `SeatMap` documents by `{ isAvailable: true }`.
 * Useful for displaying live seat availability counts.
 *
 * @see SeatMap
 */
ShowingSchema.virtual("availableSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { isAvailable: true },
    count: true,
});

/**
 * Virtual field representing the number of seats that have been reserved.
 *
 * @remarks
 * Filters related `SeatMap` documents by `{ isReserved: true }`.
 * Useful for analytics or seat reservation tracking.
 *
 * @see SeatMap
 */
ShowingSchema.virtual("reservedSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { isReserved: true },
    count: true,
});

/**
 * Virtual field representing the number of seats that are available
 * and not currently reserved.
 *
 * @remarks
 * Filters related `SeatMap` documents by
 * `{ isAvailable: true, isReserved: false }`.
 *
 * @see SeatMap
 */
ShowingSchema.virtual("unreservedSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { isAvailable: true, isReserved: false },
    count: true,
});

/**
 * Enables support for `.lean({ virtuals: true })` queries.
 *
 * @remarks
 * Without this plugin, virtuals would not appear in results when using
 * Mongoose's `lean()` option.
 */
ShowingSchema.plugin(mongooseLeanVirtuals);
