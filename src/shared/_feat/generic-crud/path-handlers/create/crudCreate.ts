/**
 * @fileoverview Generic controller and service for creating new documents within a Mongoose model.
 */

import populateQuery from "@/shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@/shared/_types/model/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@/shared/_feat/fetch-request-options/utils";
import type {CreateDocumentConfig} from "@/shared/_feat/generic-crud/path-handlers/create/crudCreate.types";
import {isDuplicateIndexError} from "@/shared/utility/mongoose/isDuplicateIndexError";
import {handleDuplicateIndexError} from "@/shared/utility/mongoose/handleDuplicateIndexError";
import type {CRUDControllerHandlerConfig} from "@/shared/_feat/generic-crud/types/CRUDControllerHandler";
import type {ControllerAsyncFunc} from "@/shared/_types/controllers/ControllerTypes";

/**
 * Instantiates, persists, and populates a new Mongoose document.
 */
export async function createDocument<TModel extends BaseModel>(
    {model, data, populatePaths, options, onDuplicateIndex, deriveData}: CreateDocumentConfig<TModel>
): Promise<TModel> {
    try {
        const derived = deriveData ? deriveData(data) : {};
        const newDoc = new model({...data, ...derived});
        const doc = await newDoc.save();

        const query = populateQuery({
            query: model.findById(doc._id),
            config: {...options, populatePaths},
        });

        return query.orFail();
    } catch (error: unknown) {
        if (isDuplicateIndexError(error)) {
            handleDuplicateIndexError({
                error,
                modelName: model.modelName,
                handleIndex: onDuplicateIndex,
            });
        }

        throw error;
    }
}

/**
 * Generates an Express controller for handling document creation requests.
 */
export function create<TModel extends BaseModel, TInput = unknown>(
    {model, populatePaths, onDuplicateIndex, deriveData}: CRUDControllerHandlerConfig<TModel, TInput>
): ControllerAsyncFunc {
    return async (req: Request, res: Response) => {
        const options = fetchRequestOptions(req);
        const data = req.validatedBody;

        const item = await createDocument({
            model,
            options,
            data,
            populatePaths,
            onDuplicateIndex,
            deriveData,
        });

        return res.status(200).json(item);
    }
}