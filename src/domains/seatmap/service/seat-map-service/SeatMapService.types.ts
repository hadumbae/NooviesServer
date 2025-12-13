import type ISeatMap from "../../model/SeatMap.interface.js";
import { Types } from "mongoose";

/**
 * Parameters required to identify a SeatMap by its associated showing.
 */
export type ByShowingIDParams = {
    /** The ObjectId of the showing to create or manipulate a seat map for. */
    showingID: Types.ObjectId;
};

/**
 * Parameters required to identify a specific SeatMap.
 */
export type BySeatMapIDParams = {
    /** The ObjectId of the SeatMap to update or toggle availability. */
    seatMapID: Types.ObjectId;
};

/**
 * Service interface for operations on `SeatMap` entities.
 *
 * Provides methods for creating seat maps and toggling seat availability.
 */
export interface SeatMapServiceMethods {
    /**
     * Creates a seat map for a given showing.
     *
     * @param params - Object containing the `showingID` for which to create the seat map.
     * @returns A promise that resolves when the seat map has been successfully created.
     *
     * @example
     * ```ts
     * await seatMapService.createShowingSeatMap({ showingID: someObjectId });
     * ```
     */
    createShowingSeatMap(params: ByShowingIDParams): Promise<void>;

    /**
     * Toggles the availability of a specific seat map.
     *
     * @param params - Object containing the `seatMapID` of the seat map to update.
     * @returns A promise that resolves to the updated `ISeatMap` instance.
     *
     * @example
     * ```ts
     * const updatedSeatMap = await seatMapService.toggleSeatMapAvailability({ seatMapID: someSeatMapId });
     * console.log(updatedSeatMap);
     * ```
     */
    toggleSeatMapAvailability(params: BySeatMapIDParams): Promise<ISeatMap>;
}
