/**
 * @file Write-layer CRUD type contracts.
 * CRUDWriter.types.ts
 */

import type {ModelObject} from "../../types/ModelObject.js";
import {Types} from "mongoose";
import type {RequestOptions} from "../../types/request-options/RequestOptions.js";

/**
 * Parameters for create operations.
 */
export type CRUDCreateParams<TInput = unknown> = {
    data: Partial<TInput>;
    options?: RequestOptions;
};

/**
 * Parameters for the underlying update operation.
 */
export type CRUDUpdateActionParams<TSchema = ModelObject, TInput = unknown> = {
    _id: Types.ObjectId;
    data: Partial<TInput>;
    unset?: Partial<TSchema>;
    options?: RequestOptions;
};

/**
 * Parameters for update operations with retry support.
 */
export type CRUDUpdateParams<TSchema = ModelObject, TInput = unknown> =
    CRUDUpdateActionParams<TSchema, TInput> & {
    retries?: number;
};

/**
 * Write operation contract for CRUD services.
 */
export interface WriteMethods<TSchema extends ModelObject, TInput = unknown> {
    /**Creates a document.*/
    create(params: CRUDCreateParams<TInput>): Promise<TSchema>;

    /**Executes the raw create operation.*/
    createAction(params: CRUDCreateParams<TInput>): Promise<TSchema>;

    /**Updates a document.*/
    update(params: CRUDUpdateParams<TSchema, TInput>): Promise<TSchema>;

    /**Executes the raw update operation.*/
    updateAction(params: CRUDUpdateActionParams<TSchema, TInput>): Promise<TSchema>;
}