/**
 * @file Type definitions for the generic "Find By Unique Code" CRUD operation.
 * @filename crudFindByUniqueCode.types.ts
 */

import type {BaseModelWithUniqueCode} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/_feat/generic-crud/types";
import type {UniqueCode} from "@shared/validation/codes";

/**
 * Specific configuration for the "Find By Unique Code" database operation.
 */
export type FindDocumentByUniqueCodeConfig<TModel extends BaseModelWithUniqueCode> = BaseCRUDParams<TModel> & {
    /** The validated, uppercase system identifier used to locate the document. */
    uniqueCode: UniqueCode;
};