/**
 * @fileoverview Functionality to toggle the availability status of a seat map document.
 */

import {Types} from "mongoose";
import type {SeatMapSchemaFields} from "@domains/seatmap/model/SeatMap.types";
import SeatMap from "@domains/seatmap/model/SeatMap.model";
import {SeatMapPopulationPaths} from "@domains/seatmap/_feat/query-population";
import createHttpError from "http-errors";

/** Configuration containing the unique identifier for the seat map. */
type ToggleConfig = {
    _id: Types.ObjectId;
}

/**
 * Switches a seat map status between AVAILABLE and UNAVAILABLE.
 */
export async function toggleSeatMapAvailability({_id}: ToggleConfig): Promise<SeatMapSchemaFields> {
    const seatMap = await SeatMap.findById(_id).populate(SeatMapPopulationPaths);
    if (!seatMap) throw createHttpError(404, "Seat Map not found.");

    const {status} = seatMap;

    if (status !== "AVAILABLE" && status !== "UNAVAILABLE") return seatMap;
    const newStatus = status === "UNAVAILABLE" ? "AVAILABLE" : "UNAVAILABLE";

    const updatedSeatMap = await SeatMap
        .findByIdAndUpdate(_id, {status: newStatus}, {new: true})
        .populate(SeatMapPopulationPaths);

    if (!updatedSeatMap) throw createHttpError(404, "Seat Map not found for update.");

    return updatedSeatMap;
}