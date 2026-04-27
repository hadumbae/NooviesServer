/** @fileoverview Controller handlers for fetching lean, optimized data for UI inputs. */

import type {Request, Response} from "express";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {FetchLeanDataConfig} from "@domains/ui-inputs/handlers/service.types";
import {getQueryOptionFilters} from "@shared/_feat/generic-crud/path-handlers";
import {getQueryOptionSorts} from "@shared/_feat/generic-crud/path-handlers/utils/getQueryOptionSorts";
import {fetchLeanMovies} from "@domains/ui-inputs/handlers/service";

/** Function signature for services that retrieve lean model data based on filters and sorts. */
export type LeanDataHandler<TModel extends BaseModel> = (config: FetchLeanDataConfig<TModel>) => Promise<TModel[]>;

/** Higher-order function that creates an Express handler to process lean data requests using query options. */
export const handleLeanData = <TModel extends BaseModel>(
    handler: LeanDataHandler<TModel>
) => async (req: Request, res: Response) => {
    const filters = getQueryOptionFilters(req.queryOptions);
    const sorts = getQueryOptionSorts(req.queryOptions);

    const data = await handler({filters, sorts});
    return res.status(200).json(data);
};

/** Express handler for retrieving lean movie data. */
export const getFetchMovieLeanData = handleLeanData(fetchLeanMovies);