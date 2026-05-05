/**
 * @fileoverview Generic controller and service for filtering and retrieving documents of a specific model.
 */

import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/_feat/fetch-request-options/utils";
import type {FindDocumentsConfig} from "@shared/_feat/generic-crud/path-handlers/find/crudFind.types";
import type {CRUDControllerHandlerConfig} from "@shared/_feat/generic-crud/types/CRUDControllerHandler";

/** Executes a filtered database search with support for population and request modifiers. */
export const findDocuments = async <TModel extends BaseModel>(
    {model, populatePaths, filters, options, sorts}: FindDocumentsConfig<TModel>
): Promise<TModel[]> => {
    return populateQuery({
        query: model.find(filters ?? {}).sort(sorts ?? {}),
        options: {...options, populatePaths},
    });
};

/** Factory function that generates an Express controller for performing filtered searches. */
export const find = <TModel extends BaseModel>(
    {model, populatePaths}: CRUDControllerHandlerConfig<TModel>
) => {
    return async (req: Request, res: Response) => {
        const items = await findDocuments<TModel>({
            model,
            populatePaths,
            options: fetchRequestOptions(req),
            filters: req.queryMatchStage?.$match,
            sorts: req.querySortStage?.$sort
        });

        return res.status(200).json(items);
    };
};