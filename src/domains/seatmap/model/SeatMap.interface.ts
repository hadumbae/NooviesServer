import {Types} from "mongoose";
import type {SeatMapStatus} from "../schema/enum/SeatMapStatusEnumSchema.js";

/**
 * Represents a mapping between a specific seat and a specific showing,
 * including pricing and current availability status.
 *
 * @remarks
 * A `SeatMap` describes the state of an individual seat during a showing.
 * It links three entities:
 *
 * - A **showing** (`IShowing`)
 * - A **seat** (`ISeat`)
 * - A **status** (derived from {@link SeatMapStatusConstant})
 *
 * This interface is used as the Mongoose document type backing the
 * `seat_maps` collection.
 *
 * @example
 * ```ts
 * const seatMap: ISeatMap = {
 *   price: 300,
 *   showing: new Types.ObjectId(),
 *   seat: new Types.ObjectId(),
 *   status: "AVAILABLE",
 * };
 * ```
 */
export default interface ISeatMap {
    /** Unique identifier of the seat map document. Provided by MongoDB. */
    readonly _id?: Types.ObjectId;

    /** Optional price of the seat for the associated showing. */
    price?: number;

    /**
     * ObjectId reference to the showing this seat is part of.
     * Corresponds to an {@link IShowing} document.
     */
    showing: Types.ObjectId;

    /**
     * ObjectId reference to the seat being represented.
     * Corresponds to an {@link ISeat} document.
     */
    seat: Types.ObjectId;

    /**
     * Current status of this seat during the showing.
     *
     * @see SeatMapStatus
     * @see SeatMapStatusConstant
     */
    status: SeatMapStatus;
}
