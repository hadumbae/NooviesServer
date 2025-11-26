import createHttpError from "http-errors";
import SeatMap from "../../model/SeatMap.model.js";
import Showing from "../../../showing/model/Showing.model.js";
import type ISeatMap from "../../model/SeatMap.interface.js";
import Seat from "../../../seat/model/Seat.model.js";
import type { AnyBulkWriteOperation } from "mongoose";
import type { PopulatePath } from "../../../../shared/types/mongoose/PopulatePath.js";
import type { BySeatMapIDParams, ByShowingIDParams, ISeatMapService } from "./SeatMapService.types.js";

/**
 * Constructor parameters for `SeatMapService`.
 */
type SeatMapServiceConstructor = {
    /**
     * Optional array of paths to populate on SeatMap queries.
     * Useful for automatically loading related documents when fetching SeatMaps.
     */
    readonly populateRefs?: PopulatePath[];
};

/**
 * Service class for handling `SeatMap` operations.
 *
 * Provides methods to create seat maps for showings and toggle the availability
 * of individual seat maps. Supports optional population of related references.
 *
 * @implements ISeatMapService
 */
export default class SeatMapService implements ISeatMapService {
    /**
     * Internal reference paths to populate when querying `SeatMap` documents.
     * Set via the constructor or defaults to an empty array.
     */
    protected readonly _populateRefs: PopulatePath[];

    /**
     * Creates a new `SeatMapService` instance.
     *
     * @param params - Optional configuration object.
     * @param params.populateRefs - Array of reference paths to populate on queries.
     *
     * @example
     * ```ts
     * const seatMapService = new SeatMapService({ populateRefs: ["seat", "showing"] });
     * ```
     */
    constructor({ populateRefs = [] }: SeatMapServiceConstructor = {}) {
        this._populateRefs = populateRefs;
    }

    /**
     * Creates seat maps for a specific showing.
     *
     * Fetches all available seats for the showing's theatre and screen,
     * then inserts a seat map entry for each seat with status "AVAILABLE".
     *
     * @param params - Object containing the showing ID.
     * @throws Will throw a 404 error if the showing does not exist.
     *
     * @example
     * ```ts
     * await seatMapService.createShowingSeatMap({ showingID: someShowingId });
     * ```
     */
    async createShowingSeatMap({ showingID }: ByShowingIDParams): Promise<void> {
        const showing = await Showing.findById(showingID);
        if (!showing) throw createHttpError(404, "Showing Not Found.");

        const { theatre, screen } = showing;
        const seats = await Seat.find({ theatre, screen, isAvailable: true });

        if (seats.length === 0) return;

        const seatMap: AnyBulkWriteOperation<ISeatMap>[] = seats.map((seat) => {
            const document: ISeatMap = { seat: seat._id, showing: showing._id, status: "AVAILABLE" };
            return { insertOne: { document } };
        });

        await SeatMap.bulkWrite(seatMap);
    }

    /**
     * Toggles the availability status of a specific seat map.
     *
     * If the seat map status is "AVAILABLE", it becomes "UNAVAILABLE", and vice versa.
     * If the seat map has a status other than "AVAILABLE" or "UNAVAILABLE", it is returned as-is.
     *
     * @param params - Object containing the seat map ID.
     * @returns The updated `ISeatMap` document with populated references (if configured).
     * @throws Will throw a 404 error if the seat map does not exist.
     *
     * @example
     * ```ts
     * const updatedSeatMap = await seatMapService.toggleSeatMapAvailability({ seatMapID: someSeatMapId });
     * console.log(updatedSeatMap.status); // "AVAILABLE" or "UNAVAILABLE"
     * ```
     */
    async toggleSeatMapAvailability({ seatMapID }: BySeatMapIDParams): Promise<ISeatMap> {
        const seatMap = await SeatMap.findById(seatMapID).populate(this._populateRefs);
        if (!seatMap) throw createHttpError(404, "Seat Map not found.");

        const { status } = seatMap;

        if (status !== "AVAILABLE" && status !== "UNAVAILABLE") {
            return seatMap;
        }

        const newStatus = status === "UNAVAILABLE" ? "AVAILABLE" : "UNAVAILABLE";

        const updatedSeatMap = await SeatMap
            .findByIdAndUpdate(seatMapID, { status: newStatus }, { new: true })
            .populate(this._populateRefs);

        return updatedSeatMap!;
    }
}
