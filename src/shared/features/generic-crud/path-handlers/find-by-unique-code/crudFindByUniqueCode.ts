/**
 * @file Generic controller and service for retrieving documents via their standardized unique code.
 * @filename crudFindByUniqueCode.ts
 */

import type {BaseModelWithUniqueCode} from "@shared/types/schema/BaseModel";
import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {
    FindDocumentByUniqueCodeParams
} from "@shared/features/generic-crud/path-handlers/find-by-unique-code/crudFindByUniqueCode.types";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/features/fetch-request-options/utils";
import type {CRUDRouteHandlerParams} from "@shared/features/generic-crud/types/CRUDRouteHandler";

/**
 * Performs a database lookup for a document using its system-wide unique identifier.
 * @param params - Configuration including model, code string, and population options.
 * @returns A promise resolving to the found document.
 */
export const findDocumentByUniqueCode = async <TModel extends BaseModelWithUniqueCode>(
    {model, uniqueCode, populatePaths, options}: FindDocumentByUniqueCodeParams<TModel>
): Promise<TModel> => {
    const query = populateQuery({
        query: model.findOne({uniqueCode}),
        options: {...options, populatePaths},
    });

    return query.orFail();
}

/**
 * Factory function that generates an Express controller for code-based lookups.
 * @param params - Configuration including the model and optional relationship paths.
 * @returns An asynchronous Express controller function.
 */
export const findByUniqueCode = <TModel extends BaseModelWithUniqueCode>(
    {model, populatePaths}: Omit<CRUDRouteHandlerParams<TModel>, "querySchema">
) => {
    return async (req: Request, res: Response) => {
        const {uniqueCode} = req.params;
        const options = fetchRequestOptions(req);

        const item = await findDocumentByUniqueCode({
            model,
            uniqueCode,
            populatePaths,
            options,
        });

        return res.status(200).json(item);
    }
}