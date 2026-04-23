/**
 * @fileoverview Defines virtual population fields for the Showing schema to track seat metrics.
 * Uses Mongoose virtuals to derive real-time statistics from the SeatMap collection.
 */

import { ShowingSchema } from "./Showing.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * Total entries in the seat map for this showing.
 */
ShowingSchema.virtual("seatMapCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    count: true,
});

/**
 * Count of seats with the 'AVAILABLE' status.
 */
ShowingSchema.virtual("availableSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { status: "AVAILABLE" },
    count: true,
});

/**
 * Count of seats with the 'UNAVAILABLE' status (e.g., broken or blocked).
 */
ShowingSchema.virtual("unavailableSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { status: "UNAVAILABLE" },
    count: true,
});

/**
 * Count of seats with the 'RESERVED' status (pending payment).
 */
ShowingSchema.virtual("reservedSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { status: "RESERVED" },
    count: true,
});

/**
 * Count of seats with the 'SOLD' status.
 */
ShowingSchema.virtual("soldSeatsCount", {
    ref: "SeatMap",
    localField: "_id",
    foreignField: "showing",
    match: { status: "SOLD" },
    count: true,
});

/**
 * Plugin to ensure virtuals are included when using `.lean()` queries.
 */
ShowingSchema.plugin(mongooseLeanVirtuals);