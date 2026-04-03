/**
 * @file Generic controller and service for filtering and retrieving documents of a specific model.
 * @filename crudFind.ts
 */

import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/features/fetch-request-options/utils";
import type {FindDocumentsConfig} from "@shared/features/generic-crud/path-handlers/find/crudFind.types";
import type {CRUDControllerHandlerConfig} from "@shared/features/generic-crud/types/CRUDControllerHandler";
import {getQueryOptionFilters} from "@shared/features/generic-crud/path-handlers/utils/getQueryOptionFilters";

/**
 * Executes a filtered database search with support for population and request modifiers.
 * ---
 * @param params - Configuration including model, filter criteria, and population paths.
 * @returns A promise resolving to an array of matching model instances.
 */
export const findDocuments = async <TModel extends BaseModel>(
    {model, populatePaths, filters, options}: FindDocumentsConfig<TModel>
): Promise<TModel[]> => {
    return populateQuery({
        query: model.find(filters ?? {}),
        options: {...options, populatePaths},
    });
}

/**
 * Factory function that generates an Express controller for performing filtered searches.
 * ---
 * @param params - Configuration including the model, optional population paths, and query schema.
 * @returns An asynchronous Express controller function.
 */
export const find = <TModel extends BaseModel>(
    {model, populatePaths}: CRUDControllerHandlerConfig<TModel>
) => {
    return async (req: Request, res: Response) => {
        const options = fetchRequestOptions(req);

        const items = await findDocuments({
            model,
            populatePaths,
            options,
            filters: getQueryOptionFilters(req.queryOptions)
        });

        return res.status(200).json(items);
    }
}