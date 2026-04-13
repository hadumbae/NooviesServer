/**
 * @file Generic controller and service for removing documents from a Mongoose collection.
 * @filename crudDestroy.ts
 */

import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import createHttpError from "http-errors";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";
import type {DeleteDocumentConfig} from "@shared/_feat/generic-crud/path-handlers/delete/crudDestroy.types";
import type {CRUDControllerHandlerConfig} from "@shared/_feat/generic-crud/types/CRUDControllerHandler";

/**
 * Deletes a document by its ID after verifying its existence.
 * @param params - Configuration containing the model instance and target ObjectId.
 * @returns A promise that resolves once the document is successfully removed.
 */
export const deleteDocument = async <TModel extends BaseModel>(
    {model, _id}: DeleteDocumentConfig<TModel>
): Promise<void> => {
    const doc = await model.findById({_id});
    if (!doc) throw createHttpError(404, "Not found!");
    await doc.deleteOne();
}

/**
 * Factory function that generates an Express controller for document deletion.
 * @param params - Configuration containing the model instance.
 * @returns An asynchronous Express controller function.
 */
export const destroy = <TModel extends BaseModel>(
    {model}: CRUDControllerHandlerConfig<TModel>
) => {
    return async (req: Request, res: Response) => {
        const {_id} = req.params;
        const itemID = isValidObjectId(_id);

        await deleteDocument({model, _id: itemID});

        return res.status(200).json({message: "Deleted."});
    }
}