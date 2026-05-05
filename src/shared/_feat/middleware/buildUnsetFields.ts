/**
 * @fileoverview Middleware utility for unsetting unspecified model form fields in Express requests.
 */

import type {Model} from "mongoose";
import type {NextFunction, Request, RequestHandler, Response} from "express";
import type {BaseModel} from "@shared/types/schema/BaseModel";

type ModelFormParams<TModel extends BaseModel> = {
    model: Model<TModel>;
    excludeKeys?: (keyof TModel)[];
};

/**
 * Creates a RequestHandler middleware that compares the validated request body
 * with the schema fields of the provided Mongoose model and appends fields
 * that need to be unset to the request object.
 */
export function buildUnsetFields<TModel extends BaseModel>(
    {model, excludeKeys = []}: ModelFormParams<TModel>
): RequestHandler {
    const retainKeys = ["_id", "__v", "createdAt", "updatedAt", "slug", "uniqueCode", ...excludeKeys];
    const checkKeys = Object.keys(model.schema.paths).filter(k => !retainKeys.includes(k));

    return (req: Request, res: Response, next: NextFunction) => {
        if (req.validatedBody) {
            const setKeys = Object.keys(req.validatedBody);
            const unsetKeys = checkKeys.filter(k => !setKeys.includes(k));

            req.unsetFields = Object.fromEntries(unsetKeys.map(k => ([k, 1])));
        }

        next();
    };
}