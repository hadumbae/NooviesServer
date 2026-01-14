import type {ModelObject} from "../../types/ModelObject.js";
import populateQuery from "../../utility/mongoose/populateQuery.js";
import type {
    CRUDCountParams,
    CRUDFindByIDParams,
    CRUDFindBySlugParams,
    CRUDFindParams,
    CRUDPaginationParams,
    ReadMethods
} from "./CRUDReader.types.js";
import {CRUDBase} from "../base/CRUDBase.js";

/**
 * @file CRUDReader.ts
 *
 * Generic read-only CRUD service for Mongoose models.
 */

/**
 * Provides read operations for a Mongoose-backed model.
 *
 * @template TSchema - Persisted document shape
 */
export class CRUDReader<TSchema extends ModelObject>
    extends CRUDBase<TSchema>
    implements ReadMethods<TSchema>
{
    /**
     * Counts documents matching optional filters.
     *
     * @param params - Optional query filters
     * @returns Matching document count
     */
    async count({filters}: CRUDCountParams<TSchema> = {}): Promise<number> {
        return this.model.countDocuments(filters ?? {});
    }

    /**
     * Retrieves multiple documents.
     *
     * Supports population, virtuals, and optional limiting.
     *
     * @param params - Query filters and request options
     * @returns Matching documents
     */
    async find(params: CRUDFindParams<TSchema> = {}): Promise<TSchema[]> {
        const {
            filters,
            options: {populatePaths = this.populateRefs, populate, virtuals, limit} = {},
        } = params;

        const query = populateQuery({
            query: this.model.find(filters ?? {}),
            options: {populate, virtuals, populatePaths},
        });

        if (typeof limit === "number") {
            query.limit(limit);
        }

        return query;
    }

    /**
     * Retrieves a document by ObjectId.
     *
     * @param params - Identifier and request options
     * @returns Matching document
     * @throws 404 when not found
     */
    async findById(params: CRUDFindByIDParams): Promise<TSchema> {
        const {
            _id,
            options: {populatePaths = this.populateRefs, populate, virtuals} = {},
        } = params;

        try {
            const query = populateQuery({
                query: this.model.findById(_id),
                options: {populate, virtuals, populatePaths},
            });

            return query.orFail();
        } catch (error: unknown) {
            this.persistenceManager.throwFetchError(error);
        }
    }

    /**
     * Retrieves a document by slug.
     *
     * @param params - Slug identifier and request options
     * @returns Matching document
     * @throws 404 when not found
     */
    async findBySlug(params: CRUDFindBySlugParams): Promise<TSchema> {
        const {
            slug,
            options: {populatePaths = this.populateRefs, populate, virtuals} = {},
        } = params;

        try {
            const query = populateQuery({
                query: this.model.findOne({slug}),
                options: {populate, virtuals, populatePaths},
            });

            return query.orFail();
        } catch (error: unknown) {
            this.persistenceManager.throwFetchError(error);
        }
    }

    /**
     * Retrieves documents using pagination.
     *
     * @param params - Pagination, filtering, sorting, and options
     * @returns Documents for the requested page
     */
    async paginate(params: CRUDPaginationParams<TSchema>): Promise<TSchema[]> {
        const {
            page,
            perPage,
            filters,
            sort,
            options: {populatePaths = this.populateRefs, populate, virtuals} = {},
        } = params;

        const query = this.model
            .find(filters ?? {})
            .sort(sort ?? {})
            .skip((page - 1) * perPage)
            .limit(perPage);

        return populateQuery({
            query,
            options: {populate, virtuals, populatePaths},
        });
    }
}
