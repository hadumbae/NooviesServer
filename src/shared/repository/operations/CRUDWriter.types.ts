import type {ModelObject} from "../../types/ModelObject.js";
import {Types} from "mongoose";
import type {RequestOptions} from "../../types/request-options/RequestOptions.js";

/**
 * @file CRUDWriter.types.ts
 *
 * Shared types for write (create/update) CRUD operations.
 */

/**
 * Parameters for creating a document.
 *
 * @template TInput - Input payload shape
 */
export type CRUDCreateParams<TInput = unknown> = {
    /** Creation payload */
    data: Partial<TInput>;
    /** Request-level options */
    options?: RequestOptions;
};

/**
 * Parameters for updating a document.
 *
 * @template TSchema - Persisted document shape
 * @template TInput  - Input payload shape
 */
export type CRUDUpdateParams<
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

/**
 * Write CRUD contract.
 *
 * @template TSchema - Persisted document shape
 * @template TInput  - Input payload shape
 */
export interface WriteMethods<TSchema extends ModelObject, TInput = unknown> {
    /**
     * Create a new document.
     *
     * @param params - Creation payload and options
     * @returns Created document
     */
    create(params: CRUDCreateParams<TInput>): Promise<TSchema>;

    /**
     * Update an existing document.
     *
     * @param params - Identifier, update payload, and options
     * @returns Updated document
     */
    update(params: CRUDUpdateParams<TSchema, TInput>): Promise<TSchema>;
}
