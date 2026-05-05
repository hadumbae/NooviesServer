/**
 * @fileoverview Generic controller and service for retrieving paginated document collections with metadata.
 */

import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/_feat/fetch-request-options/utils";
import type {
    CountDocumentsParams,
    GetPaginatedDocumentsConfig
} from "@shared/_feat/generic-crud/path-handlers/paginated/crudPaginated.types";
import type {CRUDControllerHandlerConfig} from "@shared/_feat/generic-crud/types/CRUDControllerHandler";

/** Retrieves the total count of documents in a collection matching specific filters. */
export const countDocuments = async <TModel extends BaseModel>(
    {model, filters}: CountDocumentsParams<TModel>
): Promise<number> => model.countDocuments(filters ?? {});

/** Fetches a specific subset of documents based on pagination offsets and filters. */
export const getPaginatedDocuments = async <TModel extends BaseModel>(
    {model, filters, sorts, populatePaths, options}: GetPaginatedDocumentsConfig<TModel>
): Promise<TModel[]> => {
    const {page = 1, perPage = 25} = options ?? {};

    const query = model
        .find(filters ?? {})
        .sort(sorts ?? {})
        .skip((page - 1) * perPage)
        .limit(perPage);

    return populateQuery({
        query,
        options: {...options, populatePaths},
    });
};

/** Factory function that generates an Express controller for paginated data retrieval. */
export const paginated = <TModel extends BaseModel>(
    {model, populatePaths}: CRUDControllerHandlerConfig<TModel>
) => {
    return async (req: Request, res: Response) => {
        const options = fetchRequestOptions(req);
        const filters = req.queryMatchStage?.$match;
        const sorts = req.querySortStage?.$sort;

        const [totalItems, items] = await Promise.all([
            countDocuments<TModel>({model, filters}),
            getPaginatedDocuments<TModel>({
                model,
                populatePaths,
                options,
                filters: req.queryMatchStage?.$match ,
                sorts,
            })
        ]);

        return res.status(200).json({totalItems, items});
    };
};