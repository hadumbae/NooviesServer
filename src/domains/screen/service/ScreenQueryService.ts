import type {Request} from "express";
import {Types} from "mongoose";
import createHttpError from "http-errors";

interface ScreenQuery {
    theatre?: string;
}

export interface IScreenQueryService {
    getQuery({req}: {req: Request}): Record<string, any>;
}

export class ScreenQueryService implements IScreenQueryService {
    getQuery({req}: {req: Request<any, any, any, ScreenQuery>}): Record<string, any> {
        const { theatre } = req.query;

        let conditions: Record<string, any> = {};

        if (theatre) {
            if (!Types.ObjectId.isValid(theatre)) throw createHttpError(400, "Invalid Theatre ID");
            conditions["theatre"] = theatre;
        }

        return conditions;
    }
}