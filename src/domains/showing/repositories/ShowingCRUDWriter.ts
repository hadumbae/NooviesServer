/**
 * @file ShowingCRUDWriter.ts
 *
 * Domain-aware CRUD writer for Showings.
 *
 * Extends the base CRUDWriter with Showing-specific behavior:
 * - Timezone-aware date construction
 * - Movie-based slug generation
 * - Automatic start/end time computation
 */

import {CRUDWriter} from "../../../shared/repository/operations/CRUDWriter.js";
import type {ShowingSchemaFields} from "../model/showing/Showing.types.js";
import type {ShowingInput} from "../schema/ShowingInputSchema.js";
import type {
    CRUDCreateParams,
    CRUDUpdateParams,
} from "../../../shared/repository/operations/CRUDWriter.types.js";
import type {
    BuildShowingDateParams,
    GetShowingDateTimeParams,
    ShowingDateTimeReturns,
    ShowingCRUDWriterConstructor, ShowingWriteMethods,
} from "./ShowingCRUDWriter.types.js";
import {DateTime} from "luxon";
import Theatre from "../../theatre/model/Theatre.model.js";
import createHttpError from "http-errors";
import {Types} from "mongoose";
import MovieModel from "../../movie/model/Movie.model.js";
import generateSlug from "../../../shared/utility/generateSlug.js";
import Showing from "../model/showing/Showing.model.js";

/**
 * CRUD writer for the Showing domain.
 *
 * Handles derived fields and cross-entity validation that cannot
 * be performed at the schema or repository level.
 */
export class ShowingCRUDWriter
    extends CRUDWriter<ShowingSchemaFields>
    implements ShowingWriteMethods
{
    constructor({populateRefs}: ShowingCRUDWriterConstructor = {}) {
        super({
            model: Showing,
            populateRefs: populateRefs ?? [],
        });
    }

    /**
     * Builds a UTC Date from local date, time, and timezone.
     */
    buildDate(params: BuildShowingDateParams): Date {
        const {date, time, timezone} = params;

        return DateTime
            .fromISO(`${date}T${time}`, {zone: timezone})
            .toUTC()
            .toJSDate();
    }

    /**
     * Computes showing start and end times using the theatre timezone.
     *
     * @throws 404 if the theatre cannot be resolved
     */
    async getShowingDates(
        params: GetShowingDateTimeParams,
    ): Promise<ShowingDateTimeReturns> {
        const {theatreID, startAtDate, startAtTime, endAtDate, endAtTime} = params;

        const theatre = await Theatre
            .findById(theatreID)
            .select("location.timezone");

        if (!theatre) {
            throw createHttpError(404, "Theatre is not found.");
        }

        const {location: {timezone}} = theatre;

        const startTime = this.buildDate({
            date: startAtDate,
            time: startAtTime,
            timezone,
        });

        const endTime =
            endAtDate && endAtTime
                ? this.buildDate({date: endAtDate, time: endAtTime, timezone})
                : null;

        return {startTime, endTime};
    }

    /**
     * Generates a deterministic slug for a showing based on its movie.
     *
     * @throws 422 if the movie ID is invalid
     * @throws 404 if the movie does not exist
     */
    async generateShowingSlug(movieID: string): Promise<string> {
        if (!Types.ObjectId.isValid(movieID)) {
            throw createHttpError(422, "Invalid movie for showing.");
        }

        const movie = await MovieModel
            .findById(movieID)
            .select("title")
            .lean();

        if (!movie) {
            throw createHttpError(404, "Invalid movie for showing.");
        }

        try {
            return generateSlug(movie.title);
        } catch {
            throw createHttpError(500, "Failed to generate slug for showing.");
        }
    }

    /**
     * Creates a new showing.
     *
     * Automatically resolves:
     * - Movie-based slug
     * - Theatre timezone
     * - Start and end timestamps
     */
    async create(
        params: CRUDCreateParams<ShowingInput>,
    ): Promise<ShowingSchemaFields> {
        const {data, ...rest} = params;

        const {
            startAtTime,
            startAtDate,
            endAtTime,
            endAtDate,
            movie,
        } = data as ShowingInput;

        const slug = await this.generateShowingSlug(movie);

        const theatreID = new Types.ObjectId(data.theatre);
        const {startTime, endTime} = await this.getShowingDates({
            theatreID,
            startAtDate,
            startAtTime,
            endAtDate,
            endAtTime,
        });

        return super.create({
            ...rest,
            data: {
                ...data,
                startTime,
                endTime,
                slug,
            },
        });
    }

    /**
     * Updates an existing showing.
     *
     * Recomputes slug and date fields when dependent inputs change.
     */
    async update(
        params: CRUDUpdateParams<ShowingSchemaFields, ShowingInput>,
    ): Promise<ShowingSchemaFields> {
        const {data, ...rest} = params;

        const {
            movie,
            startAtTime,
            startAtDate,
            endAtTime,
            endAtDate,
        } = data as ShowingInput;

        const slug = await this.generateShowingSlug(movie);

        const theatreID = new Types.ObjectId(data.theatre);
        const {startTime, endTime} = await this.getShowingDates({
            theatreID,
            startAtDate,
            startAtTime,
            endAtDate,
            endAtTime,
        });

        return super.update({
            ...rest,
            data: {
                ...data,
                slug,
                startTime,
                endTime,
            },
        });
    }
}
