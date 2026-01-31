import { Types } from "mongoose";
import type { SeatMapStatus } from "../schema/enum/SeatMapStatusEnumSchema.js";
import type { SeatSchemaFields } from "../../seat/model/Seat.types.js";
import type { ShowingSchemaFields } from "../../showing/model/showing/Showing.types.js";

/**
 * Input payload for creating or updating a seat-map entry.
 *
 * Represents the association between a specific seat and
 * a specific showing, including pricing configuration and
 * availability state.
 */
export interface SeatMapInputData {
    /**
     * Associated showing.
     *
     * Accepts either an ObjectId or a populated showing document.
     */
    showing: Types.ObjectId | ShowingSchemaFields;

    /**
     * Associated seat.
     *
     * Accepts either an ObjectId or a populated seat document.
     */
    seat: Types.ObjectId | SeatSchemaFields;

    /** Base price assigned to the seat for this showing. */
    basePrice: number;

    /** Multiplier applied when calculating final pricing. */
    priceMultiplier: number;

    /**
     * Optional fixed price override.
     *
     * @remarks
     * When provided, replaces all computed pricing logic.
     */
    overridePrice?: number;

    /** Current availability state of the seat. */
    status: SeatMapStatus;
}

/**
 * Persisted MongoDB representation of a seat-map entry.
 *
 * Extends {@link SeatMapInputData} with database-managed fields.
 */
export interface SeatMapSchemaFields extends SeatMapInputData {
    /** MongoDB-generated unique identifier. */
    readonly _id: Types.ObjectId;

    /** Associated reservation when the seat is booked. */
    reservation: Types.ObjectId;
}

/**
 * Seat-map representation with the seat fully populated.
 *
 * Intended for read-heavy workflows where seat metadata
 * is required and showing context is already known.
 */
export interface SeatMapWithSeat extends SeatMapSchemaFields {
    seat: SeatSchemaFields;
}
