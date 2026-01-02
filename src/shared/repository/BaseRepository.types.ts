import { type FilterQuery, type SortOrder, Types } from "mongoose";
import type { RequestOptions } from "../types/request-options/RequestOptions.js";
import type { ModelObject } from "../types/ModelObject.js";

/**
 * @file BaseRepository.types.ts
 *
 * Base repository parameter types.
 *
 * Shared parameter shapes for repository CRUD and pagination
 * operations, independent of the underlying persistence layer.
 */

// --------------
// --- CREATE ---
// --------------

/**
 * Parameters for creating a document.
 *
 * @typeParam TInput - Input payload shape.
 */
export type BaseRepositoryCreateParams<TInput = unknown> = {
    /** Creation payload */
    data: Partial<TInput>;
    /** Request-level options */
    options?: RequestOptions;
};

// ------------
// --- READ ---
// ------------

/**
 * Parameters for counting documents.
 *
 * @typeParam TSchema - Persisted document shape.
 */
export type BaseRepositoryCountParams<TSchema = ModelObject> = {
    /** Query filters */
    filters?: FilterQuery<TSchema>;
};

/**
 * Parameters for retrieving multiple documents.
 *
 * @typeParam TSchema - Persisted document shape.
 */
export type BaseRepositoryFindParams<TSchema = ModelObject> = {
    /** Query filters */
    filters?: FilterQuery<TSchema>;
    /** Request-level options */
    options?: RequestOptions;
};

/**
 * Parameters for retrieving a document by ObjectId.
 */
export type BaseRepositoryFindByIDParams = {
    /** Target document ObjectId */
    _id: Types.ObjectId;
    /** Request-level options */
    options?: RequestOptions;
};

/**
 * Parameters for retrieving a document by slug.
 */
export type BaseRepositoryFindBySlugParams = {
    /** Unique slug identifier */
    slug: string;
    /** Request-level options */
    options?: RequestOptions;
};

/**
 * Parameters for paginated queries.
 *
 * @typeParam TSchema - Persisted document shape.
 */
export type BaseRepositoryPaginationParams<TSchema = ModelObject> = {
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

// --------------
// --- UPDATE ---
// --------------

/**
 * Parameters for updating a document.
 *
 * @typeParam TSchema - Persisted document shape.
 * @typeParam TInput  - Input payload shape.
 */
export type BaseRepositoryUpdateParams<
    TSchema = ModelObject,
    TInput = unknown
> = {
    /** Target document ObjectId */
    _id: Types.ObjectId;
    /** Updated fields */
    data: Partial<TInput>;
    /** Fields to explicitly unset */
    unset?: Partial<TSchema>;
    /** Request-level options */
    options?: RequestOptions;
};

// --------------
// --- DELETE ---
// --------------

/**
 * Parameters for deleting a document.
 */
export type BaseRepositoryDestroyParams = {
    /** Target document ObjectId */
    _id: Types.ObjectId;
};
