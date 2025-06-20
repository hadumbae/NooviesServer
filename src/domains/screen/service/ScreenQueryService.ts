import type {Request} from "express";
import {type ScreenQueryParams, ScreenQueryParamsSchema} from "../schema/query/ScreenQueryParamsSchema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import {type ScreenQueryOptionParams} from "../schema/query/ScreenQueryOptionParamsSchema.js";
import type {ScreenQueryMatchParams} from "../schema/query/ScreenQueryMatchParamsSchema.js";
import ZodParseError from "../../../shared/errors/ZodParseError.js";

export interface IScreenQueryService {
    fetchQueryParams(req: Request): ScreenQueryParams;
    generateMatchFilters(params: ScreenQueryParams): ScreenQueryMatchParams;
    generateOptions(params: ScreenQueryParams): ScreenQueryOptionParams;
}

export default class ScreenQueryService implements IScreenQueryService {
    fetchQueryParams(req: Request): ScreenQueryParams {
        const {success, data, error} = ScreenQueryParamsSchema.safeParse(req.query);
        if (!success) throw new ZodParseError({message: "Invalid Query Params.", errors: error.errors});
        return filterNullArray(data);
    }

    generateMatchFilters(params: ScreenQueryParams): ScreenQueryMatchParams {
        const {theatre} = params;

        const filters = {
            theatre,
        };

        return filterNullArray(filters);
    }

    generateOptions(params: ScreenQueryParams): ScreenQueryOptionParams {
        const {showingsPerScreen} = params;

        const filters = {
            showingsPerScreen,
        };

        return filterNullArray(filters);
    }
}