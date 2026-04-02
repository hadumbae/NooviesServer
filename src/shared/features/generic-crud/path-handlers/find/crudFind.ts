/**
 * @file Generic controller and service for filtering and retrieving documents of a specific model.
 * @filename crudFind.ts
 */

import type {CRUDRouteHandler} from "@shared/features/generic-crud/types";
import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/features/fetch-request-options/utils";
import type {CRUDRouteHandlerParams} from "@shared/features/generic-crud/types/CRUDRouteHandler";
import type {FindParams} from "@shared/features/generic-crud/path-handlers/find/crudFind.types";

/**
 * Executes a filtered database search with support for population and request modifiers.
 * ---
 * ### Mechanics
 * * **Selection:** Applies a Mongoose `FilterQuery` to the search operation, allowing
 * for targeted data retrieval beyond simple collection-wide fetches.
 * * **Query Optimization:** Pipes the resulting query through {@link populateQuery}
 * to handle join logic, virtuals, and limits defined in the request context.
 * ---
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
 * ---
 * ### Mechanics
 * * **Context Extraction:** Resolves global {@link RequestOptions} from the request
 * query string to manage result set formatting.
 * * **Standardized API:** Wraps the database logic in a consistent HTTP 200 JSON
 * response pattern.
 * ---
 * @param params - Configuration including the model and optional relationship paths.
 * @returns An asynchronous Express controller function.
 */
export const find: CRUDRouteHandler = <TModel extends BaseModel>(
    {model, populatePaths}: CRUDRouteHandlerParams<TModel>
) => {
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