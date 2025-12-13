import {SeatMapSchema} from "./SeatMap.schema.js";

/**
 * @summary
 * Virtual field computing the effective price for a seat.
 *
 * Uses `overridePrice` when present; otherwise falls back to
 * `basePrice * priceMultiplier`.
 *
 * @example
 * const seat = await SeatMapModel.findById(id).lean({virtuals: true});
 * console.log(seat.finalPrice);
 */
SeatMapSchema.virtual("finalPrice").get(function () {
    return this.overridePrice ?? (this.basePrice * this.priceMultiplier);
});
