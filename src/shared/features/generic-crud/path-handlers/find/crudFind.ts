/**
 * @file Generic controller and service for filtering and retrieving documents of a specific model.
 * @filename crudFind.ts
 */

import type {CRUDRouteHandler} from "@shared/features/generic-crud/types";
import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/features/fetch-request-options/utils";
import type {FindParams} from "@shared/features/generic-crud/path-handlers/find/crudFind.types";

/**
 * Executes a filtered database search with support for population and request modifiers.
 * @param params - Configuration including model, filter criteria, and population paths.
 * @returns A promise resolving to an array of matching model instances.
 */
export const findDocuments = async <TModel extends BaseModel>(
    {model, populatePaths, filters, options}: FindParams<TModel>
): Promise<TModel[]> => {
    return populateQuery({
        query: model.find(filters ?? {}),
        options: {...options, populatePaths},
    });
}

/**
 * Factory function that generates an Express controller for performing filtered searches.
 * @param params - Configuration including the model and optional relationship paths.
 * @returns An asynchronous Express controller function.
 */
export const find: CRUDRouteHandler<BaseModel> = ({model, populatePaths}) => {
    return async (req: Request, res: Response) => {
        const options = fetchRequestOptions(req);

        const items = await findDocuments({
            model,
            populatePaths,
            options,
        });

        return res.status(200).json(items);
    }
}