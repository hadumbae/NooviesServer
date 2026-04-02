/**
 * @file Generic controller and service for retrieving paginated document collections.
 * @filename crudPaginated.ts
 */

import type {CRUDRouteHandler} from "@shared/features/generic-crud/types";
import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/features/fetch-request-options/utils";
import type {CRUDRouteHandlerParams} from "@shared/features/generic-crud/types/CRUDRouteHandler";
import type {
    CountDocumentsParams,
    GetPaginatedDocumentsParams
} from "@shared/features/generic-crud/path-handlers/paginated/crudPaginated.types";

/**
 * Retrieves the total count of documents in a collection for pagination metadata.
 * ---
 * ### Mechanics
 * * **Efficiency:** Executes a specialized `countDocuments` query to minimize
 * database overhead compared to fetching full records.
 * ---
 * @param params - Configuration containing the target Mongoose model.
 * @returns A promise resolving to the total number of documents.
 */
export const countDocuments = async <TModel extends BaseModel>(
    {model}: CountDocumentsParams<TModel>
): Promise<number> => model.countDocuments({});

/**
 * Fetches a specific subset of documents based on pagination offsets.
 * ---
 * ### Mechanics
 * * **Offset Logic:** Calculates `skip` and `limit` values derived from the
 * `page` and `perPage` options.
 * * **Hydration:** Forwards the paginated cursor to {@link populateQuery} to
 * apply relational population and virtual field injection.
 * ---
 * @param params - Database model, population paths, and pagination options.
 * @returns A promise resolving to an array of model instances for the current page.
 */
export const getPaginatedDocuments = async <TModel extends BaseModel>(
    {model, populatePaths, options}: GetPaginatedDocumentsParams<TModel>
): Promise<TModel[]> => {
    const {page = 1, perPage = 25, populate, virtuals} = options ?? {};

    const query = model
        .find({})
        .skip((page - 1) * perPage)
        .limit(perPage);

    return populateQuery({
        query,
        options: {populate, virtuals, populatePaths},
    });
}

/**
 * Factory function that generates an Express controller for paginated data retrieval.
 * @param params - Configuration including the model and optional relationship paths.
 * @returns An asynchronous Express controller function.
 */
export const paginated: CRUDRouteHandler = <TModel extends BaseModel>(
    {model, populatePaths}: CRUDRouteHandlerParams<TModel>
) => {
    return async (req: Request, res: Response) => {
        const options = fetchRequestOptions(req);

        const [totalItems, items] = await Promise.all([
            countDocuments({model}),
            getPaginatedDocuments({model, populatePaths, options})
        ]);

        return res.status(200).json({totalItems, items});
    }
}