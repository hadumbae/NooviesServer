/**
 * @file Type definitions for the generic "Update" CRUD operation.
 * @filename crudUpdate.types.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/_feat/generic-crud/types";
import type {RequestOptions} from "@shared/_feat/fetch-request-options/schemas";
import type {NonNegativeNumber} from "@shared/schema/numbers/NonNegativeNumberSchema";
import {Types} from "mongoose";

/**
 * Configuration parameters for executing a document update with concurrency and error handling.
 */
export type UpdateDocumentConfig<
    TModel extends BaseModel,
    TInput = unknown
> = Omit<BaseCRUDParams<TModel>, "options"> & {
    /** The validated Mongoose ObjectId of the document to be updated. */
    _id: Types.ObjectId;

    /** The key-value pairs to be updated or added to the document. */
    data: Partial<TInput>;

    /**
     * Optional fields to be removed from the document using the Mongoose $unset operator.
     * Typed to the model to ensure only valid schema paths are targeted.
     */
    unset?: Partial<TModel>;

    /** Restricted subset of {@link RequestOptions} used to hydrate the document after the update. */
    options?: Pick<RequestOptions, "populate" | "virtuals">;

    /** Optional callback triggered if the update violates a unique database index. */
    onDuplicateIndex?: (indexString: string) => never;

    /**
     * The number of times the update should be re-attempted if a
     * VersionError (parallel save conflict) occurs.
     */
    retries?: NonNegativeNumber;
};