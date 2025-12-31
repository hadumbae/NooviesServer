import type { Model } from "mongoose";
import type { Request, Response, NextFunction } from "express";

/**
 * Parameters for {@link unsetModelFormFields} middleware factory.
 *
 * @template TModel - The Mongoose document type for the model.
 */
type ModelFormParams<TModel = any> = {
    /** The Mongoose model to inspect for schema fields. */
    model: Model<TModel>;
    excludeKeys?: (keyof TModel)[];
};

/**
 * Middleware factory that marks fields in a Mongoose model that are missing from the validated request body.
 *
 * This middleware:
 * 1. Extracts all keys from the model's schema, ignoring `_id`, `__v`, `createdAt`, and `updatedAt`.
 * 2. Compares these keys against `req.validatedBody` to determine which fields are missing.
 * 3. Stores the missing fields in `req.unsetFields` as an object with keys mapped to `1`.
 * 4. Calls `next()` to continue the middleware chain.
 *
 * This is useful for PATCH-like operations where only a subset of fields is provided,
 * and you want to track which fields should be unset in the database.
 *
 * @template TModel - The Mongoose document type for the model.
 * @param params - Parameters containing the Mongoose model.
 * @returns An Express middleware function.
 *
 * @example
 * ```ts
 * import UserModel from "./models/User";
 * app.patch("/users/:id", validateUserUpdate, unsetModelFormFields({ model: UserModel }), async (req, res) => {
 *   const updateData = req.validatedBody;
 *   const unsetFields = req.unsetFields;
 *   await UserModel.updateOne({ _id: req.params.id }, { $set: updateData, $unset: unsetFields });
 *   res.sendStatus(204);
 * });
 * ```
 */
export default function unsetModelFormFields<TModel = any>(params: ModelFormParams<TModel>) {
    const { model, excludeKeys = [] } = params;

    const modelKeys = Object
        .keys(model.schema.paths)
        .filter(k => !["_id", "__v", "createdAt", "updatedAt", "slug", ...excludeKeys].includes(k));

    return (req: Request, res: Response, next: NextFunction) => {
        if (req.validatedBody) {
            const bodyKeys = Object.keys(req.validatedBody);
            const keysToRemove = modelKeys.filter(k => !bodyKeys.includes(k));
            req.unsetFields = Object.fromEntries(keysToRemove.map(k => ([k, 1])));
        }

        next();
    };
}
