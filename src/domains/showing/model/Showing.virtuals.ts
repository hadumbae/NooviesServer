import {ShowingSchema} from "./Showing.schema.js";

/**
 * @fileoverview
 * Defines virtual population fields for the `Showing` Mongoose schema.
 *
 * @description
 * These virtuals provide computed seat statistics for each showing by
 * referencing the `SeatMap` collection. They are used to count seats
 * in various states (available, reserved, etc.) without storing the
 * values directly in the database.
 *
 * Each virtual uses Mongoose's `count` option to return the number
 * of matching seat documents instead of populating full records.
 *
 * ---
 *
 * ### Virtual Fields
 * - **seatMapCount** — Total number of seat map entries for this showing.
 * - **availableSeatsCount** — Seats currently available for reservation.
 * - **reservedSeatsCount** — Seats that are already reserved.
 * - **unreservedSeatsCount** — Seats that are available and not reserved.
 */

/**
 * Counts all seat map entries linked to this showing.
 *
 * @remarks
 * Uses Mongoose virtual population with `count: true` for efficient
 * aggregation of related seat maps.
 */
ShowingSchema.virtual("seatMapCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    count: true,
});

/**
 * Counts seats that are currently marked as available.
 *
 * @remarks
 * Filters `SeatMap` documents by `{ isAvailable: true }`.
 */
ShowingSchema.virtual("availableSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: {isAvailable: true},
    count: true,
});

/**
 * Counts seats that have been reserved.
 *
 * @remarks
 * Filters `SeatMap` documents by `{ isReserved: true }`.
 */
ShowingSchema.virtual("reservedSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: {isReserved: true},
    count: true,
});

/**
 * Counts seats that are both available and not reserved.
 *
 * @remarks
 * Filters `SeatMap` documents by `{ isAvailable: true, isReserved: false }`.
 */
ShowingSchema.virtual("unreservedSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: {isAvailable: true, isReserved: false},
    count: true,
});
