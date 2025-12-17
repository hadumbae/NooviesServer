import {TheatreSchema} from "./Theatre.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * @file Theatre.virtuals.ts
 *
 * Virtual fields and plugins for the Theatre schema.
 *
 * Defines derived count-based relationships and enables support for
 * virtuals on lean queries via `mongoose-lean-virtuals`.
 */

// --- Virtuals ---

/**
 * Count of screens associated with the theatre.
 *
 * Resolved via a virtual population on the Screen model.
 */
TheatreSchema.virtual("screenCount", {
    ref: "Screen",
    localField: "_id",
    foreignField: "theatre",
    count: true,
});

/**
 * Count of seats associated with the theatre.
 *
 * Resolved via a virtual population on the Seat model.
 */
TheatreSchema.virtual("seatCount", {
    ref: "Seat",
    localField: "_id",
    foreignField: "theatre",
    count: true,
});

/**
 * Count of future showings associated with the theatre.
 *
 * Intended to be populated with an additional query-level filter
 * (e.g. `startTime >= now`) when used.
 */
TheatreSchema.virtual("futureShowingCount", {
    ref: "Showing",
    localField: "_id",
    foreignField: "theatre",
    count: true,
});

// --- Plugins ---

/**
 * Enables virtual population support when using `lean({ virtuals: true })`.
 */
TheatreSchema.plugin(mongooseLeanVirtuals);
