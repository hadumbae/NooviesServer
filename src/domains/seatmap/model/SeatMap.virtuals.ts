/**
 * @file SeatMap.virtuals.ts
 *
 * Virtual field definitions for the SeatMap schema.
 *
 * Provides computed pricing and seat-position metadata,
 * primarily for read and layout-oriented workflows.
 */

import {SeatMapSchema} from "./SeatMap.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import type {SeatSchemaFields} from "../../seat/model/Seat.types.js";

/**
 * Computes the effective price for a seat map entry.
 *
 * @remarks
 * - Uses `overridePrice` when defined
 * - Falls back to `basePrice * priceMultiplier`
 * - Requires `mongoose-lean-virtuals` when queried via `.lean()`
 *
 * @example
 * ```ts
 * const seatMap = await SeatMapModel
 *   .findById(id)
 *   .populate("seat")
 *   .lean({ virtuals: true });
 *
 * seatMap.finalPrice;
 * ```
 */
SeatMapSchema.virtual("finalPrice").get(function () {
    if (this.overridePrice) {
        return this.overridePrice;
    }

    return this.basePrice * this.priceMultiplier;
});

/**
 * X-coordinate of the seat.
 *
 * @remarks
 * Only available when the `seat` reference is populated.
 */
SeatMapSchema.virtual("x").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as SeatSchemaFields).x;
    }

    return undefined;
});

/**
 * Y-coordinate of the seat.
 *
 * @remarks
 * Only available when the `seat` reference is populated.
 */
SeatMapSchema.virtual("y").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as SeatSchemaFields).y;
    }

    return undefined;
});

/**
 * Logical row identifier for the seat.
 *
 * @remarks
 * Only available when the `seat` reference is populated.
 */
SeatMapSchema.virtual("row").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as SeatSchemaFields).row;
    }

    return undefined;
});

/**
 * Human-readable seat label.
 *
 * @remarks
 * Only available when the `seat` reference is populated.
 */
SeatMapSchema.virtual("seatLabel").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as SeatSchemaFields).seatLabel ?? undefined;
    }

    return undefined;
});

/**
 * Enables virtual fields on lean query results.
 *
 * @remarks
 * Must be registered **after** all virtual definitions.
 */
SeatMapSchema.plugin(mongooseLeanVirtuals);
