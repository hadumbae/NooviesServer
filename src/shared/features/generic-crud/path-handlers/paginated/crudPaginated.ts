/**
 * @file Generic controller and service for retrieving paginated document collections with metadata.
 * @filename crudPaginated.ts
 */

import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/features/fetch-request-options/utils";
import type {
    CountDocumentsParams,
    GetPaginatedDocumentsConfig
} from "@shared/features/generic-crud/path-handlers/paginated/crudPaginated.types";
import type {CRUDControllerHandlerConfig} from "@shared/features/generic-crud/types/CRUDControllerHandler";
import type {ZodType} from "zod";
import {getQueryOptionFilters} from "@shared/features/generic-crud/path-handlers/utils/getQueryOptionFilters";

/**
 * Retrieves the total count of documents in a collection matching specific filters.
 * ---
 * @param params - Configuration containing the target Mongoose model and filters.
 * @returns A promise resolving to the total count of matching documents.
 */
export const countDocuments = async <TModel extends BaseModel>(
    {model, filters}: CountDocumentsParams<TModel>
): Promise<number> => model.countDocuments(filters ?? {});

/**
 * Fetches a specific subset of documents based on pagination offsets and filters.
 * ---
 * @param params - Model, filters, population paths, and pagination options.
 * @returns A promise resolving to the array of documents for the current page.
 */
export const getPaginatedDocuments = async <TModel extends BaseModel>(
    {model, filters, populatePaths, options}: GetPaginatedDocumentsConfig<TModel>
): Promise<TModel[]> => {
    const {page = 1, perPage = 25} = options ?? {};

    const query = model
        .find(filters ?? {})
        .skip((page - 1) * perPage)
        .limit(perPage);

    return populateQuery({
        query,
        options: {...options, populatePaths},
    });
}

/**
 * Factory function that generates an Express controller for paginated data retrieval.
 * ---
 * @param params - Configuration including the model, optional population paths, and query schema.
 * @returns An asynchronous Express controller function.
 */
export const paginated = <TModel extends BaseModel, TSchema extends ZodType>(
    {model, populatePaths}: CRUDControllerHandlerConfig<TModel>
) => {
    return async (req: Request, res: Response) => {
        const options = fetchRequestOptions(req);

        const filters = getQueryOptionFilters(req.queryOptions);

        const [totalItems, items] = await Promise.all([
            countDocuments({model, filters}),
            getPaginatedDocuments({
                model,
                populatePaths,
                options,
                filters,
            })
        ]);

        return res.status(200).json({totalItems, items});
    }
}