/**
 * @file Screen.virtuals.ts
 *
 * @summary
 * Virtual fields and plugins for the Screen schema.
 *
 * @description
 * Defines computed, non-persistent fields for screens and
 * enables lean query support for virtual population.
 */

import { ScreenSchema } from "./Screen.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";

/**
 * @summary
 * Count of future showings for the screen.
 *
 * @description
 * Computed virtual that counts showings associated with the screen.
 * Typically filtered at query time to include only future showings.
 */
ScreenSchema.virtual("futureShowingCount", {
    ref: "Showing",
    localField: "_id",
    foreignField: "screen",
    count: true,
});

/**
 * @summary
 * Total seat count for the screen.
 *
 * @description
 * Computed virtual that counts all seats assigned to the screen.
 */
ScreenSchema.virtual("seatCount", {
    ref: "Seat",
    localField: "_id",
    foreignField: "screen",
    count: true,
});

/**
 * @summary
 * Enables lean query support for virtual fields.
 */
ScreenSchema.plugin(mongooseLeanVirtuals);
