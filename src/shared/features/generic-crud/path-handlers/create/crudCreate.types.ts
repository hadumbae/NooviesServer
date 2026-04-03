/**
 * @file Type definitions for the generic "Create" CRUD operation.
 * @filename crudCreate.types.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/features/generic-crud/types";
import type {RequestOptions} from "@shared/features/fetch-request-options/schemas";

/**
 * Specific configuration for the "Create" database operation.
 * ---
 * ### Mechanics
 * * **Strict Options:** Uses an `Omit` on the base params to replace full request options
 * with a specialized subset (only `populate` and `virtuals`), as pagination is
 * irrelevant for single document creation.
 * * **Error Mapping:** Provides an optional `onDuplicateIndex` callback to translate
 * specific database constraints into domain-specific error messages.
 * ---
 */
export type CreateDocumentConfig<TModel extends BaseModel, TInput = unknown> = Omit<BaseCRUDParams<TModel>, "options"> & {
    /** The raw data payload used to instantiate the model. */
    data: Partial<TInput>;

    /** Restricted subset of {@link RequestOptions} applicable to a single document response. */
    options?: Pick<RequestOptions, "populate" | "virtuals">;

    /** Optional handler invoked when a unique index violation occurs. */
    onDuplicateIndex?: (indexString: string) => never;
};