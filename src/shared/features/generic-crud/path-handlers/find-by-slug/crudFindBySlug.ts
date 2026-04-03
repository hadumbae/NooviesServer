/**
 * @file Generic controller and service for retrieving a single document via a URL-friendly slug.
 * @filename crudFindBySlug.ts
 */

import type {CRUDRouteHandler} from "@shared/features/generic-crud/types";
import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/features/fetch-request-options/utils";
import type {FindBySlugParams} from "@shared/features/generic-crud/path-handlers/find-by-slug/crudFindBySlug.types";

/**
 * Executes a database lookup for a document matching a specific slug string.
 * @param params - Database model, slug string, and query options.
 * @returns A promise resolving to the found document.
 */
export const findDocumentBySlug = async <TModel extends BaseModel>(
    {model, slug, populatePaths, options}: FindBySlugParams<TModel>
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
export const findBySlug: CRUDRouteHandler<BaseModel> = ({model, populatePaths}) => {
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