import {type FilterQuery, type SortOrder, Types} from "mongoose";
import type {RequestOptions} from "../types/request-options/RequestOptions.js";
import type {ModelObject} from "../types/ModelObject.js";

/**
 * Base repository parameter types.
 *
 * Shared parameter shapes for repository methods.
 * Generic types correspond to the underlying Mongoose schema shape.
 */

/**
 * Parameters for counting documents.
 *
 * @template TSchema - Mongoose document shape.
 */
export type BaseRepositoryCountParams<TSchema = ModelObject> = {
    /** Query filter conditions. */
    filters?: FilterQuery<TSchema>;
};

/**
 * Parameters for retrieving multiple documents.
 *
 * @template TSchema - Mongoose document shape.
 */
export type BaseRepositoryFindParams<TSchema = ModelObject> = {
    /** Query filter conditions. */
    filters?: FilterQuery<TSchema>;
    /** Request-level behavior options. */
    options?: RequestOptions;
};

/**
 * Parameters for retrieving a document by ObjectId.
 */
export type BaseRepositoryFindByIDParams = {
    /** Target document ObjectId. */
    _id: Types.ObjectId;
    /** Request-level behavior options. */
    options?: RequestOptions;
};

/**
 * Parameters for retrieving a document by slug.
 */
export type BaseRepositoryFindBySlugParams = {
    /** Unique slug identifier. */
    slug: string;
    /** Request-level behavior options. */
    options?: RequestOptions;
};

/**
 * Parameters for creating a document.
 *
 * @template TSchema - Mongoose document shape.
 */
export type BaseRepositoryCreateParams<TSchema = ModelObject> = {
    /** Data used to create the document. */
    data: Partial<TSchema>;
    /** Request-level behavior options. */
    options?: RequestOptions;
};

/**
 * Parameters for updating a document.
 *
 * @template TSchema - Mongoose document shape.
 */
export type BaseRepositoryUpdateParams<TSchema = ModelObject> = {
    /** Target document ObjectId. */
    _id: Types.ObjectId;
    /** Fields to update. */
    data: Partial<TSchema>;
    /** Fields to explicitly unset. */
    unset?: Partial<TSchema>;
    /** Request-level behavior options. */
    options?: RequestOptions;
};

/**
 * Parameters for deleting a document.
 */
export type BaseRepositoryDestroyParams = {
    /** Target document ObjectId. */
    _id: Types.ObjectId;
};

/**
 * Parameters for paginated queries.
 *
 * @template TSchema - Mongoose document shape.
 */
export type BaseRepositoryPaginationParams<TSchema = ModelObject> = {
    /** 1-based page index. */
    page: number;
    /** Number of documents per page. */
    perPage: number;
    /** Sort definition. */
    sort?: string | [string, SortOrder][] | Record<string, SortOrder>;
    /** Query filter conditions. */
    filters?: FilterQuery<TSchema>;
    /** Request-level behavior options. */
    options?: RequestOptions;
};
