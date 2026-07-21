/**
 * @fileoverview Virtual field definitions and plugin configurations for the Screen schema.
 * Provides computed relationships for inventory and scheduling without persisting
 * redundant data in MongoDB.
 */

import { ScreenSchema } from "./Screen.schema";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * Virtual: futureShowingCount
 */
ScreenSchema.virtual("futureShowingCount", {
    ref: "Showing",
    localField: "_id",
    foreignField: "screen",
    count: true,
});

/**
 * Virtual: seatCount
 */
ScreenSchema.virtual("seatCount", {
    ref: "Seat",
    localField: "_id",
    foreignField: "screen",
    count: true,
});

/**
 * Plugin: mongoose-lean-virtuals
 */
ScreenSchema.plugin(mongooseLeanVirtuals);