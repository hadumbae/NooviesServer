import type {Model} from "mongoose";
import type {Request, Response, NextFunction} from "express";

type ModelFormParams<TModel = any> = {
    model: Model<TModel>
};

export default function UnsetModelFormFields<TModel = any>(params: ModelFormParams<TModel>) {
    const {model} = params;

    const modelKeys = Object
        .keys(model.schema.paths)
        .filter(k => !["_id", "__v", "createdAt", "updatedAt"].includes(k));

    return (req: Request, res: Response, next: NextFunction) => {
        if (req.validatedBody) {
            const bodyKeys = Object.keys(req.validatedBody);
            const keysToRemove = modelKeys.filter(k => !bodyKeys.includes(k));
            req.unsetFields = Object.fromEntries(keysToRemove.map(k => ([k, 1])));

            console.log(req.unsetFields);
        }

        next();
    }
}