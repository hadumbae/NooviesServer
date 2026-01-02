/**
 * @file ShowingRepositoryCRUD.ts
 *
 * @description
 * Repository contract for the Showing domain.
 *
 * Extends the shared {@link BaseRepositoryCRUD} interface with
 * Showing-specific persistence and domain logic, including
 * slug generation and date/time construction.
 */

import type BaseRepositoryCRUD from "../../../shared/repository/BaseRepositoryCRUD.js";
import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";
import type {ShowingInput} from "../schema/ShowingInputSchema.js";
import type {
    BaseRepositoryCreateParams,
    BaseRepositoryUpdateParams
} from "../../../shared/repository/BaseRepository.types.js";
import type {ShowingSchemaFields} from "../model/Showing.types.js";
import {Types} from "mongoose";
import type {SimpleDateString} from "../../../shared/schema/date-time/SimpleDateStringSchema.js";
import type {TimeString} from "../../../shared/schema/date-time/TimeStringSchema.js";
import type {IANATimezone} from "../../../shared/schema/date-time/IANATimezoneSchema.js";

/**
 * Constructor options for a Showing repository.
 */
export type ShowingRepositoryConstructor = {
    /**
     * Default populate paths applied to repository queries.
     */
    readonly populateRefs?: PopulatePath[];
};

/**
 * CRUD repository interface for Showings.
 *
 * @remarks
 * Adds domain-aware behavior that cannot be expressed generically
 * at the base repository level.
 */
export interface ShowingRepositoryCRUD
    extends BaseRepositoryCRUD<ShowingSchemaFields>
{
    /**
     * Generates a deterministic slug for a showing based on its movie.
     *
     * @param movieID - Movie ObjectId as a string
     * @returns Generated slug
     */
    generateShowingSlug(movieID: string): Promise<string>;

    /**
     * Creates a new showing.
     */
    create(
        params: BaseRepositoryCreateParams<ShowingInput>
    ): Promise<ShowingSchemaFields>;

    /**
     * Updates an existing showing.
     */
    update(
        params: BaseRepositoryUpdateParams<ShowingSchemaFields, ShowingInput>
    ): Promise<ShowingSchemaFields>;

    /**
     * Builds a JavaScript Date from date, time, and timezone components.
     */
    buildDate(params: BuildShowingDateParams): Date;

    /**
     * Computes start and end Date values for a showing.
     */
    getShowingDates(
        params: GetShowingDateTimeParams
    ): Promise<ShowingDateTimeReturns>;
}

/**
 * Parameters for building a Date from discrete components.
 */
export type BuildShowingDateParams = {
    /** ISO date string. */
    date: SimpleDateString;
    /** Time string (HH:mm:ss). */
    time: TimeString;
    /** IANA timezone identifier. */
    timezone: IANATimezone;
};

/**
 * Parameters for computing showing start and end times.
 */
export type GetShowingDateTimeParams = {
    /** Theatre hosting the showing. */
    theatreID: Types.ObjectId;
    /** Start date. */
    startAtDate: SimpleDateString;
    /** Start time. */
    startAtTime: TimeString;
    /** Optional end date; defaults to start date. */
    endAtDate?: SimpleDateString;
    /** Optional end time. */
    endAtTime?: TimeString;
};

/**
 * Computed showing date/time values.
 */
export type ShowingDateTimeReturns = {
    /** Start time as a JavaScript Date. */
    startTime: Date;
    /** End time as a JavaScript Date, or null if not defined. */
    endTime: Date | null;
};
