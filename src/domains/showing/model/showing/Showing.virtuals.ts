import { ShowingSchema } from "./Showing.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * @file ShowingSeatMapVirtuals.ts
 *
 * Declares seat-count virtual population fields for the `Showing` schema.
 *
 * @remarks
 * These virtuals expose **derived seat statistics** from related `SeatMap`
 * documents without duplicating data.
 *
 * All virtuals use Mongoose virtual population with `count: true`,
 * returning only document counts for efficient querying.
 *
 * ---
 * ### Virtual Field Summary
 * | Virtual Name | Description | Status Match |
 * |--------------|-------------|--------------|
 * | `seatMapCount` | Total number of seats for the showing | — |
 * | `availableSeatsCount` | Seats currently available | `AVAILABLE` |
 * | `unavailableSeatsCount` | Seats marked unavailable | `UNAVAILABLE` |
 * | `reservedSeatsCount` | Seats reserved but not sold | `RESERVED` |
 * | `soldSeatsCount` | Seats that have been sold | `SOLD` |
 *
 * ---
 * @example
 * ```ts
 * const showings = await Showing.find().lean({ virtuals: true });
 * console.log(showings[0].availableSeatsCount);
 * ```
 */

/**
 * Total number of seat map entries associated with this showing.
 */
ShowingSchema.virtual("seatMapCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    count: true,
});

/**
 * Number of seats currently available for booking.
 */
ShowingSchema.virtual("availableSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { status: "AVAILABLE" },
    count: true,
});

/**
 * Number of seats that are unavailable.
 */
ShowingSchema.virtual("unavailableSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { status: "UNAVAILABLE" },
    count: true,
});

/**
 * Number of seats that have been reserved.
 */
ShowingSchema.virtual("reservedSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { status: "RESERVED" },
    count: true,
});

/**
 * Number of seats that have been sold.
 */
ShowingSchema.virtual("soldSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { status: "SOLD" },
    count: true,
});

/**
 * Enables support for `.lean({ virtuals: true })`.
 *
 * @remarks
 * Required for virtual fields to appear in lean query results.
 */
ShowingSchema.plugin(mongooseLeanVirtuals);
