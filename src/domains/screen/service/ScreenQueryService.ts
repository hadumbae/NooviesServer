import type {Request} from "express";
import {ScreenQuerySchema} from "../schema/ScreenQuerySchema.js";
import filterNullArray from "../../../shared/utility/filterNullArray.js";
import type {FilterQuery} from "mongoose";

interface ScreenQuery {
    theatre?: string;
}

export interface IScreenQueryService {
    getQuery({req}: {req: Request}): Record<string, any>;
}

export default class ScreenQueryService implements IScreenQueryService {
    getQuery({req}: {req: Request<any, any, any, ScreenQuery>}): FilterQuery<ScreenQuery> {
        const { theatre } = ScreenQuerySchema.parse(req.query);

        let conditions: Record<string, any> = {theatre};

        return filterNullArray(conditions);
    }
}