import type {Request} from "express";
import {ScreenQuerySchema} from "../schema/ScreenQuerySchema.js";

interface ScreenQuery {
    theatre?: string;
}

export interface IScreenQueryService {
    getQuery({req}: {req: Request}): Record<string, any>;
}

export default class ScreenQueryService implements IScreenQueryService {
    getQuery({req}: {req: Request<any, any, any, ScreenQuery>}): Record<string, any> {
        const { theatre } = ScreenQuerySchema.parse(req.query);

        let conditions: Record<string, any> = {};

        if (theatre) {
            conditions["theatre"] = theatre;
        }

        return conditions;
    }
}