import { type FilterQuery, type SortOrder, Types } from "mongoose";
import type { PopulatePath } from "../mongoose/PopulatePath.js";

/**
 * Parameters for counting documents in a repository.
 *
 * @template TSchema - Type of the Mongoose document.
 */
export type BaseRepositoryCountParams<TSchema = Record<string, any>> = {
    /** Optional filters to apply when counting documents. */
    filters?: Record<string, unknown>;
};

/**
 * Parameters for finding multiple documents in a repository.
 *
 * @template TSchema - Type of the Mongoose document.
 */
export type BaseRepositoryFindParams<TSchema = Record<string, any>> = {
    /** Optional filters to narrow the search. */
    filters?: FilterQuery<TSchema>;
    /** Specific paths to populate instead of the repository's default. */
    populatePath?: PopulatePath[];
    /** Whether to populate referenced paths. Defaults to `false`. */
    populate?: boolean;
    /** Whether to include virtual fields in lean queries. Defaults to `false`. */
    virtuals?: boolean;
    /** Optional limit for the number of returned documents. */
    limit?: number;
};

/**
 * Parameters for finding a document by its ID.
 */
export type BaseRepositoryFindByIDParams = {
    /** The MongoDB ObjectId of the document. */
    _id: Types.ObjectId;
    /** Whether to include virtual fields in lean queries. */
    virtuals?: boolean;
    /** Whether to populate referenced paths. */
    populate?: boolean;
    /** Specific paths to populate instead of the repository's default. */
    populatePath?: PopulatePath[];
};

/**
 * Parameters for creating a new document in the repository.
 *
 * @template TSchema - Type of the Mongoose document.
 */
export type BaseRepositoryCreateParams<TSchema = Record<string, any>> = {
    /** Partial document data to create. */
    data: Partial<TSchema>;
    /** Specific paths to populate after creation. */
    populatePath?: PopulatePath[];
    /** Whether to populate referenced paths after creation. */
    populate?: boolean;
    /** Whether to include virtual fields in lean queries after creation. */
    virtuals?: boolean;
};

/**
 * Parameters for updating an existing document in the repository.
 *
 * @template TSchema - Type of the Mongoose document.
 */
export type BaseRepositoryUpdateParams<TSchema = Record<string, any>> = {
    /** The MongoDB ObjectId of the document to update. */
    _id: Types.ObjectId;
    /** Fields to update. */
    data: Partial<TSchema>;
    /** Fields to unset (remove). */
    unset?: Partial<TSchema>;
    /** Specific paths to populate after update. */
    populatePath?: string[];
    /** Whether to populate referenced paths after update. */
    populate?: boolean;
    /** Whether to include virtual fields in lean queries after update. */
    virtuals?: boolean;
};

/**
 * Parameters for deleting a document from the repository.
 */
export type BaseRepositoryDestroyParams = {
    /** The MongoDB ObjectId of the document to delete. */
    _id: Types.ObjectId;
};

/**
 * Parameters for paginating documents in the repository.
 *
 * @template TSchema - Type of the Mongoose document.
 */
export type BaseRepositoryPaginationParams<TSchema = Record<string, any>> = {
    /** The page number (1-based). */
    page: number;
    /** Number of documents per page. */
    perPage: number;
    /** Sorting criteria. Can be a string, array, or object. */
    sort?: string | [string, SortOrder][] | Record<string, SortOrder>;
    /** Optional filters to narrow the results. */
    filters?: FilterQuery<TSchema>;
    /** Specific paths to populate. */
    populatePath?: string[];
    /** Whether to populate referenced paths. */
    populate?: boolean;
    /** Whether to include virtual fields in lean queries. */
    virtuals?: boolean;
};
