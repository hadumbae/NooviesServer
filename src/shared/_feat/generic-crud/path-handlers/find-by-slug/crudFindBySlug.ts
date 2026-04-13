/**
 * @file Generic controller and service for retrieving a single document via a URL-friendly slug.
 * @filename crudFindBySlug.ts
 */

import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModelWithSlug} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/_feat/fetch-request-options/utils";
import type {FindDocumentBySlugConfig} from "@shared/_feat/generic-crud/path-handlers/find-by-slug/crudFindBySlug.types";
import type {CRUDControllerHandlerConfig} from "@shared/_feat/generic-crud/types/CRUDControllerHandler";

/**
 * Executes a database lookup for a document matching a specific slug string.
 * @param params - Database model, slug string, and query options.
 * @returns A promise resolving to the found document.
 */
export const findDocumentBySlug = async <TModel extends BaseModelWithSlug>(
    {model, slug, populatePaths, options}: FindDocumentBySlugConfig<TModel>
): Promise<TModel> => {
    const query = populateQuery({
        query: model.findOne({slug}),
        options: {...options, populatePaths},
    });

    return query.orFail();
}

/**
 * Factory function that generates an Express controller for slug-based lookups.
 * @param params - Configuration including the model and optional relationship paths.
 * @returns An asynchronous Express controller function.
 */
export const findBySlug = <TModel extends BaseModelWithSlug>(
    {model, populatePaths}: CRUDControllerHandlerConfig<TModel>
) => {
    return async (req: Request, res: Response) => {
        const {slug} = req.params;
        const options = fetchRequestOptions(req);

        const item = await findDocumentBySlug({
            model,
            slug,
            populatePaths,
            options,
        });

        return res.status(200).json(item);
    }
}