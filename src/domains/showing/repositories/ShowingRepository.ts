/**
 * @file ShowingRepository.ts
 *
 * @description
 * MongoDB repository implementation for the Showing domain.
 *
 * Extends the shared {@link BaseRepository} with Showing-specific
 * persistence and domain logic:
 *
 * - Generates deterministic slugs based on the linked movie title
 * - Resolves theatre timezone to construct UTC-safe date values
 * - Derives start/end times from date, time, and location inputs
 * - Implements {@link ShowingRepositoryCRUD}
 */

import BaseRepository from "../../../shared/repository/BaseRepository.js";
import type {ShowingSchemaFields} from "../model/Showing.types.js";
import type {
    BuildShowingDateParams,
    GetShowingDateTimeParams,
    ShowingDateTimeReturns,
    ShowingRepositoryConstructor,
    ShowingRepositoryCRUD
} from "./ShowingRepository.types.js";
import Showing from "../model/Showing.model.js";
import createHttpError from "http-errors";
import MovieModel from "../../movie/model/Movie.model.js";
import generateSlug from "../../../shared/utility/generateSlug.js";
import type {
    BaseRepositoryCreateParams,
    BaseRepositoryUpdateParams
} from "../../../shared/repository/BaseRepository.types.js";
import type {ShowingInput} from "../schema/ShowingInputSchema.js";
import {Types} from "mongoose";
import {DateTime} from "luxon";
import Theatre from "../../theatre/model/Theatre.model.js";

/**
 * Repository responsible for Showing persistence and domain behavior.
 */
export default class ShowingRepository
    extends BaseRepository<ShowingSchemaFields>
    implements ShowingRepositoryCRUD
{
    /**
     * Creates a new Showing repository instance.
     *
     * @param populateRefs - Default populate paths for queries
     */
    constructor({populateRefs}: ShowingRepositoryConstructor) {
        super({
            model: Showing,
            populateRefs: populateRefs ?? [],
        });
    }

    /**
     * Builds a UTC Date from a local date, time, and timezone.
     */
    buildDate(params: BuildShowingDateParams): Date {
        const {date, time, timezone} = params;

        return DateTime
            .fromISO(`${date}T${time}`, {zone: timezone})
            .toUTC()
            .toJSDate();
    }

    /**
     * Computes start and end times for a showing using the theatre timezone.
     *
     * @throws 404 if the theatre cannot be resolved
     */
    async getShowingDates(
        params: GetShowingDateTimeParams
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
     * Generates a slug for a showing based on its movie title.
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
     * Automatically:
     * - Generates a slug
     * - Resolves theatre timezone
     * - Computes start and end times
     */
    async create(
        params: BaseRepositoryCreateParams<ShowingInput>
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
     * Recomputes slug and date fields when relevant inputs change.
     */
    async update(
        params: BaseRepositoryUpdateParams<ShowingSchemaFields, ShowingInput>
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
