/**
 * @file Type definitions for the generic "Find By Slug" CRUD operation.
 * @filename crudFindBySlug.types.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {BaseCRUDParams} from "@shared/features/generic-crud/types";
import type {SlugString} from "@shared/schema/strings/SlugStringSchema";

/**
 * Specific configuration for the "Find By Slug" database operation.
 */
export type FindDocumentBySlugConfig<TModel extends BaseModel> = BaseCRUDParams<TModel> & {
    /** The URL-friendly string identifier used to locate the document. */
    slug: SlugString;
};