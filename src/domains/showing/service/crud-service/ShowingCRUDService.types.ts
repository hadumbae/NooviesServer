import type IShowing from "../../model/IShowing.js";
import type {TimeString} from "../../../../shared/schema/date-time/TimeStringSchema.js";
import type {IANATimezone} from "../../../../shared/schema/date-time/IANATimezoneSchema.js";
import type {PopulatePath} from "../../../../shared/types/mongoose/PopulatePath.js";
import type {ShowingInput} from "../../schema/ShowingInputSchema.js";
import {Types} from "mongoose";
import type {SimpleDateString} from "../../../../shared/schema/date-time/SimpleDateStringSchema.js";

/**
 * Parameters to build a JavaScript Date object from date, time, and timezone.
 */
export type BuildShowingDateParams = {
    /** ISO-format date string for the showing. */
    date: SimpleDateString;
    /** Time string (HH:mm:ss) for the showing. */
    time: TimeString;
    /** IANA timezone identifier for the date/time. */
    timezone: IANATimezone;
};

/**
 * Parameters for computing start and end Date objects for a showing.
 */
export type GetShowingDateTimeParams = {
    /** The ObjectId of the theatre hosting the showing. */
    theatreID: Types.ObjectId;
    /** Start date string for the showing. */
    startAtDate: SimpleDateString;
    /** Start time string for the showing. */
    startAtTime: TimeString;
    /** Optional end date string; defaults to start date if not provided. */
    endAtDate?: SimpleDateString;
    /** Optional end time string; defaults to null if not provided. */
    endAtTime?: TimeString;
};

/**
 * Result object returned from {@link IShowingCRUDService.getShowingDates}.
 */
export type ShowingDateTimeReturns = {
    /** Computed start time as a JavaScript `Date`. */
    startTime: Date;
    /** Computed end time as a JavaScript `Date`, or `null` if not specified. */
    endTime: Date | null;
};

/**
 * Parameters for creating a new showing.
 */
export type ShowingCreateParams = {
    /** Input data for the new showing. */
    data: ShowingInput;
    /** Optional array of paths to populate related documents. */
    populatePaths?: PopulatePath[];
    /** Whether to populate referenced documents. Defaults to false. */
    populate?: boolean;
    /** Whether to include virtual fields in the returned object. Defaults to false. */
    virtuals?: boolean;
};

/**
 * Parameters for updating an existing showing.
 */
export type ShowingUpdateParams = {
    /** The ObjectId of the showing to update. */
    _id: Types.ObjectId;
    /** Input data for updating the showing. */
    data: ShowingInput;
    /** Optional fields to unset/remove from the document. */
    unset?: Partial<IShowing>;
    /** Optional array of paths to populate after update. */
    populatePaths?: string[];
    /** Whether to populate referenced documents. Defaults to false. */
    populate?: boolean;
    /** Whether to include virtual fields in the returned object. Defaults to false. */
    virtuals?: boolean;
};

/**
 * Constructor parameters for {@link IShowingCRUDService}-implementing services.
 */
export interface IShowingCRUDServiceConstructor {
    /** Optional default paths to populate for queries. */
    populateRefs?: PopulatePath[];
}

/**
 * Interface defining the CRUD service for showings.
 *
 * @remarks
 * Provides methods for building date objects, computing showing start/end times,
 * and creating/updating showings in the database.
 */
export interface IShowingCRUDService {
    /**
     * Build a JavaScript Date object from date, time, and timezone.
     *
     * @param params - Object containing `date`, `time`, and `timezone`.
     * @returns A UTC `Date` object.
     */
    buildDate(params: BuildShowingDateParams): Date;

    /**
     * Compute the start and end Date objects for a showing.
     *
     * @param params - Parameters including theatre ID, start and optional end date/time.
     * @returns A Promise resolving to `ShowingDateTimeReturns` containing `startTime` and `endTime`.
     */
    getShowingDates(params: GetShowingDateTimeParams): Promise<ShowingDateTimeReturns>;

    /**
     * Create a new showing in the database.
     *
     * @param params - Creation parameters including input data and population/virtual options.
     * @returns A Promise resolving to the created {@link IShowing}.
     */
    create(params: ShowingCreateParams): Promise<IShowing>;

    /**
     * Update an existing showing by its ID.
     *
     * @param params - Update parameters including the `_id`, input data, optional unset fields, and population/virtual options.
     * @returns A Promise resolving to the updated {@link IShowing}.
     */
    update(params: ShowingUpdateParams): Promise<IShowing>;
}
