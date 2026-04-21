/**
 * @fileoverview Virtual field definitions and plugin configurations for the Theatre schema.
 * Provides derived metrics for venue capacity and scheduling through virtual population.
 */

import {TheatreSchema} from "./Theatre.schema";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * Virtual: screenCount
 */
TheatreSchema.virtual("screenCount", {
    ref: "Screen",
    localField: "_id",
    foreignField: "theatre",
    count: true,
});

/**
 * Virtual: seatCount
 */
TheatreSchema.virtual("seatCount", {
    ref: "Seat",
    localField: "_id",
    foreignField: "theatre",
    count: true,
});

/**
 * Virtual: futureShowingCount
 */
TheatreSchema.virtual("futureShowingCount", {
    ref: "Showing",
    localField: "_id",
    foreignField: "theatre",
    count: true,
});

/**
 * Plugin: mongoose-lean-virtuals
 */
TheatreSchema.plugin(mongooseLeanVirtuals);