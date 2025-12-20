import type IShowing from "../model/IShowing.js";
import {DateTime} from "luxon";
import type {
    BuildShowingDateParams, GetShowingDateTimeParams,
    IShowingCRUDService,
    ShowingCreateParams, IShowingCRUDServiceConstructor, ShowingDateTimeReturns, ShowingUpdateParams
} from "./crud-service/ShowingCRUDService.types.js";
import Showing from "../model/Showing.model.js";
import createHttpError from "http-errors";
import {Types} from "mongoose";
import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";
import Theatre from "../../theatre/model/Theatre.model.js";

/**
 * Service providing CRUD operations for showings, implementing {@link IShowingCRUDService}.
 *
 * @remarks
 * This service handles:
 * - Building JS Date objects from date, time, and timezone.
 * - Calculating showing start and end times.
 * - Creating and updating showings in the database.
 * - Optional population of referenced documents and virtual fields.
 *
 * Example usage:
 * ```ts
 * const service = new ShowingCRUDService({ populateRefs: ["theatre", "screen"] });
 * const newShowing = await service.create({data: showingInput});
 * ```
 */
export default class ShowingCRUDService implements IShowingCRUDService {
    /** Default population references for queries. */
    private readonly populateRefs: PopulatePath[];

    /**
     * @param params.populateRefs - Optional array of default paths to populate in queries.
     */
    constructor(params: IShowingCRUDServiceConstructor = {}) {
        const {populateRefs = []} = params;
        this.populateRefs = populateRefs;
    }

    /**
     * Converts date and time strings in a given IANA timezone into a UTC Date object.
     *
     * @param params - Object containing `date`, `time`, and `timezone`.
     * @returns A JavaScript `Date` in UTC.
     */
    buildDate(params: BuildShowingDateParams): Date {
        const {date, time, timezone} = params;
        return DateTime
            .fromISO(`${date}T${time}`, {zone: timezone})
            .toUTC()
            .toJSDate();
    }

    /**
     * Computes start and end `Date` objects for a showing.
     *
     * @param params - Parameters including theatre ID, start/end date, and time.
     * @throws Throws `404` if the theatre is not found.
     * @returns A Promise resolving to an object containing `startTime` and `endTime`.
     */
    async getShowingDates(params: GetShowingDateTimeParams): Promise<ShowingDateTimeReturns> {
        const {theatreID, startAtDate, startAtTime, endAtDate, endAtTime} = params;

        // ⚡ Theatre ⚡
        const theatre = await Theatre.findById(theatreID).select("location.timezone");
        if (!theatre) throw createHttpError(404, "Theatre is not found.");
        const {location: {timezone}} = theatre;

        // ⚡ Start & End ⚡
        const startTime = this.buildDate({date: startAtDate, time: startAtTime, timezone});
        const endTime = (endAtTime && endAtDate)
            ? this.buildDate({date: endAtDate, time: endAtTime, timezone})
            : null;

        return {
            startTime,
            endTime,
        };
    }

    /**
     * Creates a new showing in the database.
     *
     * @param params - Creation parameters including input data and optional population/virtual options.
     * @param params.data - Input data for the new showing.
     * @param params.populatePath - Optional paths to populate in this operation. Defaults to class `populateRefs`.
     * @param params.populate - Whether to populate referenced documents. Defaults to false.
     * @param params.virtuals - Whether to include virtual fields in the returned object. Defaults to false.
     * @throws Throws if the theatre associated with the showing is not found.
     * @returns A Promise resolving to the created {@link IShowing}.
     */
    async create(params: ShowingCreateParams): Promise<IShowing> {
        const {data, populatePaths, populate, virtuals = false} = params;
        const {startAtTime, startAtDate, endAtTime, endAtDate, ...showingData} = data;

        // ⚡ Start & End ⚡
        const theatreID = new Types.ObjectId(showingData.theatre);
        const {startTime, endTime} = await this.getShowingDates({
            theatreID,
            startAtDate,
            startAtTime,
            endAtDate,
            endAtTime
        });

        // --- Create Showing ---
        const doc = await Showing.create({
            ...showingData,
            startTime,
            endTime,
        });

        // --- Fetch Showing With Options ---
        const query = Showing.findById(doc._id);
        if (populate) query.populate(populatePaths ?? this.populateRefs);
        if (virtuals) query.lean({virtuals: true});
        const showing = await query;

        // --- Showing Not Found ---
        if (!showing) {
            throw createHttpError(500, "Showing not found!");
        }

        return showing;
    }

    /**
     * Updates an existing showing by its ID.
     *
     * @param params - Update parameters including `_id`, input data, optional unset fields, and population/virtual options.
     * @param params._id - The ObjectId of the showing to update.
     * @param params.data - Input data for updating the showing.
     * @param params.unset - Optional fields to unset/remove from the document.
     * @param params.populatePath - Optional paths to populate in this operation. Defaults to class `populateRefs`.
     * @param params.populate - Whether to populate referenced documents. Defaults to false.
     * @param params.virtuals - Whether to include virtual fields in the returned object. Defaults to false.
     * @throws Throws `404` if the showing to update is not found.
     * @returns A Promise resolving to the updated {@link IShowing}.
     */
    async update(params: ShowingUpdateParams): Promise<IShowing> {
        const {_id, data, unset, populatePaths, populate, virtuals = false} = params;

        // ⚡ Start & End ⚡
        const {startAtTime, startAtDate, endAtTime, endAtDate, ...updateData} = data;
        const theatreID = new Types.ObjectId(updateData.theatre);
        const {startTime, endTime} = await this.getShowingDates({
            theatreID,
            startAtDate,
            startAtTime,
            endAtDate,
            endAtTime,
        });

        // ⚡ Update Object ⚡
        const updateObject: Record<string, any> = {$set: {...updateData, startTime, endTime}};
        if (unset) updateObject.$unset = unset;

        // ⚡ Query Options ⚡
        const query = Showing.findByIdAndUpdate(_id, updateObject, {new: true});
        if (populate) query.populate(populatePaths ?? this.populateRefs);
        if (virtuals) query.lean({virtuals});
        const showing = await query;

        if (!showing) throw createHttpError(404, "Showing not found!");
        return showing;
    }
}
