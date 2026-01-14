import type {ModelObject} from "../../types/ModelObject.js";
import {type FilterQuery, type SortOrder, Types} from "mongoose";
import type {RequestOptions} from "../../types/request-options/RequestOptions.js";

/**
 * @file CRUDReader.types.ts
 *
 * Shared types for read-only CRUD operations.
 */

/**
 * Parameters for counting documents.
 *
 * @template TSchema - Persisted document shape
 */
export type CRUDCountParams<TSchema = ModelObject> = {
    /** Query filters */
    filters?: FilterQuery<TSchema>;
};

/**
 * Parameters for retrieving multiple documents.
 *
 * @template TSchema - Persisted document shape
 */
export type CRUDFindParams<TSchema = ModelObject> = {
    /** Query filters */
    filters?: FilterQuery<TSchema>;
    /** Request-level options */
    options?: RequestOptions;
};

/**
 * Parameters for retrieving a document by ObjectId.
 */
export type CRUDFindByIDParams = {
    /** Target document ObjectId */
    _id: Types.ObjectId;
    /** Request-level options */
    options?: RequestOptions;
};

/**
 * Parameters for retrieving a document by slug.
 */
export type CRUDFindBySlugParams = {
    /** Unique slug identifier */
    slug: string;
    /** Request-level options */
    options?: RequestOptions;
};

/**
 * Parameters for paginated queries.
 *
 * @template TSchema - Persisted document shape
 */
export type CRUDPaginationParams<TSchema = ModelObject> = {
    /** 1-based page index */
    page: number;
    /** Documents per page */
    perPage: number;
    /** Sort definition */
    sort?: string | [string, SortOrder][] | Record<string, SortOrder>;
    /** Query filters */
    filters?: FilterQuery<TSchema>;
    /** Request-level options */
    options?: RequestOptions;
};

/**
 * Read-only CRUD contract.
 *
 * @template TSchema - Persisted document shape
 */
export interface ReadMethods<TSchema extends ModelObject> {
    /**
     * Count documents matching optional filters.
     *
     * @param params - Filter parameters
     * @returns Number of matching documents
     */
    count(params?: CRUDCountParams<TSchema>): Promise<number>;

    /**
     * Retrieve multiple documents.
     *
     * @param params - Query filters and options
     * @returns Matching documents
     */
    find(params?: CRUDFindParams<TSchema>): Promise<TSchema[]>;

    /**
     * Retrieve a document by ObjectId.
     *
     * @param params - Identifier and options
     * @returns Matching document
     */
    findById(params: CRUDFindByIDParams): Promise<TSchema>;

    /**
     * Retrieve a document by slug.
     *
     * @param params - Slug identifier and options
     * @returns Matching document
     */
    findBySlug(params: CRUDFindBySlugParams): Promise<TSchema>;

    /**
     * Retrieve documents using pagination.
     *
     * @param params - Pagination, filtering, sorting, and options
     * @returns Documents for the requested page
     */
    paginate(params: CRUDPaginationParams<TSchema>): Promise<TSchema[]>;
}
