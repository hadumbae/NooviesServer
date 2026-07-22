/**
 * @fileoverview Defines the data structures and types for seat map documents and their variations.
 */

import {Types} from "mongoose";
import type {SeatMapStatus} from "@/domains/seatmap/_validation/fields/SeatMapStatusSchema";
import type {ShowingSchemaFields} from "@/domains/showing/_models/showing/Showing.types.js";
import type {SeatSchemaFields} from "@/domains/seat/_models";

/** Input data required to create or update a seat map entry. */
export type SeatMapInputData = {
    showing: Types.ObjectId | ShowingSchemaFields;
    seat: Types.ObjectId | SeatSchemaFields;
    basePrice: number;
    priceMultiplier: number;
    overridePrice?: number;
    status: SeatMapStatus;
};

/** Represents the full set of fields for a seat map document in the database. */
export type SeatMapSchemaFields = SeatMapInputData & {
    readonly _id: Types.ObjectId;
    reservation: Types.ObjectId;
};

/** A seat map document where the seat field is populated with full seat details. */
export type SeatMapWithSeat = Omit<SeatMapSchemaFields, "seat"> & {
    seat: SeatSchemaFields;
}
