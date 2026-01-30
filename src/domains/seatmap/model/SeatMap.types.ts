import {Types} from "mongoose";
import type {SeatMapStatus} from "../schema/enum/SeatMapStatusEnumSchema.js";
import type {SeatSchemaFields} from "../../seat/model/Seat.types.js";
import type {ShowingSchemaFields} from "../../showing/model/showing/Showing.types.js";

/**
 * @interface SeatMapInputData
 * @description
 * Input payload used to create or update a seat-map entry for a showing.
 *
 * Represents the relationship between a specific seat and a specific showing,
 * including pricing and availability metadata.
 */
export interface SeatMapInputData {
    /**
     * Reference to the associated showing.
     * Accepts either a populated `IShowing` document or its ObjectId.
     */
    showing: Types.ObjectId | ShowingSchemaFields;

    /**
     * Reference to the associated seat.
     * Accepts either a populated `ISeat` document or its ObjectId.
     */
    seat: Types.ObjectId | SeatSchemaFields;

    /**
     * Base price assigned to the seat for this showing.
     */
    basePrice: number;

    /**
     * Multiplier applied to the base price when calculating final pricing.
     */
    priceMultiplier: number;

    /**
     * Optional fixed price override.
     * When provided, this value replaces any computed pricing logic.
     */
    overridePrice?: number;

    /**
     * Current availability or booking state of the seat.
     */
    status: SeatMapStatus;
}

/**
 * @interface SeatMapSchemaFields
 * @description
 * Persisted MongoDB representation of a seat-map entry.
 *
 * Extends {@link SeatMapInputData} with database-managed fields.
 */
export interface SeatMapSchemaFields extends SeatMapInputData {
    /**
     * MongoDB-generated unique identifier.
     */
    readonly _id: Types.ObjectId;
}
