import {Types} from "mongoose";
import type {SeatMapStatus} from "../schema/enum/SeatMapStatusEnumSchema.js";

/**
 * @file ISeatMap.ts
 * @summary
 * Document type describing a seat’s state for a specific showing,
 * including pricing and availability.
 *
 * Each SeatMap links:
 * - a showing (`IShowing`)
 * - a seat (`ISeat`)
 * - a status (from {@link SeatMapStatus})
 *
 * Stored in the `seat_maps` collection.
 *
 * @example
 * const seatMap: ISeatMap = {
 *   price: 300,
 *   showing: new Types.ObjectId(),
 *   seat: new Types.ObjectId(),
 *   status: "AVAILABLE",
 * };
 */
export default interface ISeatMap {
    /** MongoDB-generated identifier. */
    readonly _id?: Types.ObjectId;

    /** Reference to the showing (`IShowing`). */
    showing: Types.ObjectId;

    /** Reference to the seat (`ISeat`). */
    seat: Types.ObjectId;

    /** Base price for this seat during the showing. */
    basePrice: number;

    /** Multiplier applied to the base price. */
    priceMultiplier: number;

    /** Optional override price that replaces computed pricing. */
    overridePrice?: number;

    /** Availability state for this seat. */
    status: SeatMapStatus;
}
