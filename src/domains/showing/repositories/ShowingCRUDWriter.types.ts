/**
 * @file ShowingCRUDWriter.types.ts
 *
 * Type contracts for Showing-specific write operations.
 */

import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";
import type {ShowingInput} from "../schema/ShowingInputSchema.js";
import type {ShowingSchemaFields} from "../model/Showing.types.js";
import {Types} from "mongoose";
import type {SimpleDateString} from "../../../shared/schema/date-time/SimpleDateStringSchema.js";
import type {TimeString} from "../../../shared/schema/date-time/TimeStringSchema.js";
import type {IANATimezone} from "../../../shared/schema/date-time/IANATimezoneSchema.js";
import type {
    CRUDCreateParams,
    CRUDUpdateParams,
    WriteMethods,
} from "../../../shared/repository/operations/CRUDWriter.types.js";

/**
 * Constructor options for ShowingCRUDWriter.
 */
export type ShowingCRUDWriterConstructor = {
    /** Default populate paths applied to write operations. */
    readonly populateRefs?: PopulatePath[];
};

/**
 * Parameters for building a Date from discrete components.
 */
export type BuildShowingDateParams = {
    date: SimpleDateString;
    time: TimeString;
    timezone: IANATimezone;
};

/**
 * Parameters for computing showing start and end times.
 */
export type GetShowingDateTimeParams = {
    theatreID: Types.ObjectId;
    startAtDate: SimpleDateString;
    startAtTime: TimeString;
    endAtDate?: SimpleDateString;
    endAtTime?: TimeString;
};

/**
 * Computed showing time values.
 */
export type ShowingDateTimeReturns = {
    startTime: Date;
    endTime: Date | null;
};

/**
 * Write contract for Showing repositories.
 *
 * Adds domain-aware behavior on top of generic CRUD writes.
 */
export interface ShowingWriteMethods
    extends WriteMethods<ShowingSchemaFields>
{
    generateShowingSlug(movieID: string): Promise<string>;

    buildDate(params: BuildShowingDateParams): Date;

    getShowingDates(
        params: GetShowingDateTimeParams,
    ): Promise<ShowingDateTimeReturns>;

    create(
        params: CRUDCreateParams<ShowingInput>,
    ): Promise<ShowingSchemaFields>;

    update(
        params: CRUDUpdateParams<ShowingSchemaFields, ShowingInput>,
    ): Promise<ShowingSchemaFields>;
}
