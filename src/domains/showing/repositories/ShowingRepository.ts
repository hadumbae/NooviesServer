/**
 * @file ShowingRepository.ts
 *
 * @description
 * MongoDB repository implementation for `Showing` documents.
 *
 * Extends the shared `BaseRepository` with domain-specific behavior:
 * - Automatically generates and assigns a slug based on the linked movie title
 * - Validates movie references before persistence
 * - Implements `ShowingRepositoryCRUD`
 */
import BaseRepository from "../../../shared/repository/BaseRepository.js";
import type {ShowingSchemaFields} from "../model/Showing.types.js";
import type {
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

/**
 * Repository for managing `Showing` persistence and domain logic.
 *
 * @template ShowingSchemaFields
 */
export default class ShowingRepository
    extends BaseRepository<ShowingSchemaFields, ShowingInput>
    implements ShowingRepositoryCRUD<ShowingSchemaFields>
{
    /**
     * Creates a new `ShowingRepository`.
     *
     * @param populateRefs - Optional population configuration for related fields
     */
    constructor({populateRefs}: ShowingRepositoryConstructor) {
        super({
            model: Showing,
            populateRefs: populateRefs ?? [],
        });
    }

    /**
     * Generates a URL-safe slug for a showing based on its associated movie.
     *
     * @param data - Showing input containing a movie reference
     * @returns Generated slug string
     *
     * @throws 422 If the movie reference is missing or invalid
     * @throws 404 If the referenced movie does not exist
     * @throws 500 If slug generation fails
     */
    async generateShowingSlug({movie: movieID}: ShowingInput): Promise<string> {
        if (!movieID || !Types.ObjectId.isValid(movieID)) {
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
     * Creates a new showing and automatically assigns a generated slug.
     *
     * @param params - Repository creation parameters
     * @returns Persisted showing document
     */
    async create(
        params: BaseRepositoryCreateParams<ShowingInput>
    ): Promise<ShowingSchemaFields> {
        const {data, ...rest} = params;
        const slug = await this.generateShowingSlug(data as ShowingInput);

        return super.create({
            ...rest,
            data: {...data, slug},
        });
    }

    /**
     * Updates an existing showing and regenerates its slug if necessary.
     *
     * @param params - Repository update parameters
     * @returns Updated showing document
     */
    async update(
        params: BaseRepositoryUpdateParams<ShowingSchemaFields, ShowingInput>
    ): Promise<ShowingSchemaFields> {
        const {data, ...rest} = params;
        const slug = await this.generateShowingSlug(data as ShowingInput);

        return super.update({
            ...rest,
            data: {...data, slug},
        });
    }
}
