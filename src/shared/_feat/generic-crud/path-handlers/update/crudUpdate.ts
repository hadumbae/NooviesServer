/**
 * @fileoverview Generic controller and service for updating existing documents with conflict resolution.
 */

import populateQuery from "@/shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@/shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@/shared/_feat/fetch-request-options/utils";
import {isDuplicateIndexError} from "@/shared/utility/mongoose/isDuplicateIndexError";
import {handleDuplicateIndexError} from "@/shared/utility/mongoose/handleDuplicateIndexError";
import type {UpdateDocumentConfig} from "@/shared/_feat/generic-crud/path-handlers/update/crudUpdate.types";
import {DocumentVersionError} from "@/shared/errors/DocumentVersionError";
import isValidObjectId from "@/shared/utility/mongoose/isValidObjectId";
import type {CRUDControllerHandlerConfig} from "@/shared/_feat/generic-crud/types/CRUDControllerHandler";
import type {ControllerAsyncFunc} from "@/shared/types/ControllerTypes";

/**
 * Manages document retrieval, mutation, and persistence with built-in retry logic for Mongoose version conflicts.
 */
export async function updateDocument<TModel extends BaseModel>(
    params: UpdateDocumentConfig<TModel>
): Promise<TModel> {
    const {_id, model, data, unset, populatePaths, options, onDuplicateIndex, retries = 3} = params;

    try {
        const doc = await model.findById({_id}).orFail();

        doc.set(data);
        if (unset) Object.keys(unset).forEach(key => doc.set(key, undefined));

        await doc.save();

        const query = populateQuery({
            query: model.findById(_id),
            config: {...options, populatePaths},
        });

        return query.orFail();
    } catch (error: unknown) {
        if (error instanceof Error && error.name === "VersionError") {
            if (retries > 0) {
                return updateDocument({...params, retries: retries - 1});
            }

            throw new DocumentVersionError({
                _id,
                model: model.modelName,
                raw: data,
            });
        }

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
 * Factory function that generates an Express controller for handling document update requests.
 */
export function update<TModel extends BaseModel>(
    {model, populatePaths, onDuplicateIndex}: CRUDControllerHandlerConfig<TModel>
): ControllerAsyncFunc {
    return async (req: Request, res: Response) => {
        const data = req.validatedBody;
        const unset = req.unsetFields;
        const options = fetchRequestOptions(req);

        const {_id} = req.params;
        const itemID = isValidObjectId(_id);

        const item = await updateDocument({
            model,
            options,
            data,
            unset,
            _id: itemID,
            populatePaths,
            onDuplicateIndex,
        });

        return res.status(200).json(item);
    }
}