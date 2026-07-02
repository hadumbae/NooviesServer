/**
 * @fileoverview Type definitions for the generic Create CRUD operation.
 */

import type {BaseModel} from "@/shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@/shared/_feat/generic-crud/types";
import type {RequestOptions} from "@/shared/_feat/fetch-request-options/schemas";

/** Specific configuration for the Create database operation. */
export type CreateDocumentConfig<TModel extends BaseModel, TInput = unknown> =
    Omit<BaseCRUDParams<TModel>, "options"> & {
    data: Partial<TInput>;
    options?: Pick<RequestOptions, "populate" | "virtuals">;
};