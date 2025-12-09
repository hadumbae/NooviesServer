import {type FilterQuery, type SortOrder, Types} from "mongoose";
import type {RequestOptions} from "../types/request-options/RequestOptions.js";

/**
 * Base parameter shapes for repository methods.
 * Generic types reflect the Mongoose document type.
 */

/**
 * Parameters for counting documents.
 * @template TSchema - Mongoose document type.
 */
export type BaseRepositoryCountParams<TSchema = Record<string, any>> = {
    /** Optional filter conditions. */
    filters?: FilterQuery<TSchema>;
};

/**
 * Parameters for finding multiple documents.
 * @template TSchema - Mongoose document type.
 */
export type BaseRepositoryFindParams<TSchema = Record<string, any>> = {
    /** Filter conditions for the query. */
    filters?: FilterQuery<TSchema>;
    /** Optional request-level behavior flags. */
    options?: RequestOptions;
};

/**
 * Parameters for finding a document by ID.
 */
export type BaseRepositoryFindByIDParams = {
    /** Target document ID. */
    _id: Types.ObjectId;
    /** Optional request-level behavior flags. */
    options?: RequestOptions;
};

/**
 * Parameters for creating a document.
 * @template TSchema - Mongoose document type.
 */
export type BaseRepositoryCreateParams<TSchema = Record<string, any>> = {
    /** Partial document data to create. */
    data: Partial<TSchema>;
    /** Optional request-level behavior flags. */
    options?: RequestOptions;
};

/**
 * Parameters for updating a document.
 * @template TSchema - Mongoose document type.
 */
export type BaseRepositoryUpdateParams<TSchema = Record<string, any>> = {
    /** Document ID to update. */
    _id: Types.ObjectId;
    /** Fields to update. */
    data: Partial<TSchema>;
    /** Fields to remove. */
    unset?: Partial<TSchema>;
    /** Optional request-level behavior flags. */
    options?: RequestOptions;
};

/**
 * Parameters for deleting a document.
 */
export type BaseRepositoryDestroyParams = {
    /** Document ID to delete. */
    _id: Types.ObjectId;
};

/**
 * Parameters for paginated document queries.
 * @template TSchema - Mongoose document type.
 */
export type BaseRepositoryPaginationParams<TSchema = Record<string, any>> = {
    /** 1-based page number. */
    page: number;
    /** Number of documents per page. */
    perPage: number;
    /** Sort criteria (string, tuple array, or object). */
    sort?: string | [string, SortOrder][] | Record<string, SortOrder>;
    /** Optional filter conditions. */
    filters?: FilterQuery<TSchema>;
    /** Optional request-level behavior flags. */
    options?: RequestOptions;
};
