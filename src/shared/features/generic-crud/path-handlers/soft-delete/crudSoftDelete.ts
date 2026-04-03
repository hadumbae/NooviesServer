/**
 * @file Generic controller and service for soft-deleting documents using model-level logic.
 * @filename crudSoftDelete.ts
 */

import type {BaseModel, BaseModelWithUniqueCode} from "@shared/types/schema/BaseModel";
import type {SoftDeleteParams} from "@shared/features/generic-crud/path-handlers/soft-delete/crudSoftDelete.types";
import {InvalidMethodError} from "@shared/errors/InvalidMethodError";
import type {CRUDRouteHandler} from "@shared/features/generic-crud/types";
import type {Request, Response} from "express";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";

/**
 * Executes a soft-delete by invoking a document's internal `softDelete` method.
 * @param params - Configuration containing the model instance and target ObjectId.
 * @returns A promise resolving to the updated document in its "deleted" state.
 */
export const softDeleteDocument = async <TModel extends BaseModel>(
    {model, _id}: SoftDeleteParams<TModel>
): Promise<TModel> => {
    const doc = await model.findById({_id}).orFail();

    if (typeof (doc as any).softDelete === "function") {
        return (doc as any).softDelete();
    }

    throw new InvalidMethodError({
        message: `Model '${model.modelName}' cannot soft delete.`,
        modelName: model.modelName,
        methodName: "softDelete",
    });
}

/**
 * Factory function that generates an Express controller for soft-deletion.
 * @param params - Configuration containing the model instance.
 * @returns An asynchronous Express controller function.
 */
export const softDelete: CRUDRouteHandler<BaseModel> = ({model}) => {
    return async (req: Request, res: Response) => {
        const {_id} = req.params;
        const identifier = isValidObjectId(_id);

        const item = await softDeleteDocument({
            model,
            _id: identifier,
        });

        return res.status(200).json(item);
    }
}