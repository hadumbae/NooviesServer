import { SeatMapSchema } from "./SeatMap.schema.js";
import mongooseLeanVirtuals from "mongoose-lean-virtuals";
import type ISeat from "../../seat/model/Seat.interface.js";

/**
 * @summary
 * Computes the effective price for a seat.
 *
 * @remarks
 * - Uses `overridePrice` when defined.
 * - Otherwise computes `basePrice * priceMultiplier`.
 * - Requires `mongoose-lean-virtuals` when queried via `.lean()`.
 *
 * @example
 * const seatMap = await SeatMapModel
 *   .findById(id)
 *   .populate("seat")
 *   .lean({ virtuals: true });
 *
 * seatMap.finalPrice;
 */
SeatMapSchema.virtual("finalPrice").get(function () {
    if (this.overridePrice) {
        return this.overridePrice;
    }

    return this.basePrice * this.priceMultiplier;
});

/**
 * @summary
 * Seat X-coordinate.
 *
 * @remarks
 * Exposed only when the `seat` reference is populated.
 */
SeatMapSchema.virtual("x").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as ISeat).x;
    }

    return undefined;
});

/**
 * @summary
 * Seat Y-coordinate.
 *
 * @remarks
 * Exposed only when the `seat` reference is populated.
 */
SeatMapSchema.virtual("y").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as ISeat).y;
    }

    return undefined;
});

/**
 * @summary
 * Seat row identifier.
 *
 * @remarks
 * Exposed only when the `seat` reference is populated.
 */
SeatMapSchema.virtual("row").get(function () {
    if (this.seat && typeof this.seat === "object") {
        return (this.seat as ISeat).row;
    }

    return undefined;
});

/**
 * @remarks
 * Enables virtual fields on lean query results.
 *
 * Must be registered **after** all virtual definitions.
 */
SeatMapSchema.plugin(mongooseLeanVirtuals);
