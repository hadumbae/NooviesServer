/** @fileoverview Controller handlers for fetching lean, optimized data for UI inputs. */

import type {Request, Response} from "express";
import type {BaseModel} from "@/shared/_types/model/BaseModel";
import type {FetchLeanDataConfig} from "@/domains/ui-inputs/handlers/fetchLeanDataConfig";
import {fetchPersonsForInputs} from "@/domains/ui-inputs/handlers/fetchPersonsForInputs";
import {fetchRoleTypesForInputs} from "@/domains/ui-inputs/handlers/fetchRoleTypesForInputs";
import {fetchMoviesForInputs} from "@/domains/ui-inputs/handlers/fetchMoviesForInputs";

/** Function signature for services that retrieve lean model data based on filters and sorts. */
export type LeanDataHandler<TModel extends BaseModel> = (config: FetchLeanDataConfig<TModel>) => Promise<TModel[]>;

/** Higher-order function that creates an Express handler to process lean data requests using query options. */
export const handleLeanData = <TModel extends BaseModel>(
    handler: LeanDataHandler<TModel>
) => async (req: Request, res: Response) => {
    const filters = req.queryMatchStage?.$match;
    const sorts = req.querySortStage?.$sort;

    const data = await handler({filters, sorts});
    return res.status(200).json(data);
};

/** Express handler for retrieving lean movie data. */
export const getFetchMovieLeanData = handleLeanData(fetchMoviesForInputs);
export const getFetchPersonLeanData = handleLeanData(fetchPersonsForInputs);
export const getFetchRoleTypeLeanData = handleLeanData(fetchRoleTypesForInputs);