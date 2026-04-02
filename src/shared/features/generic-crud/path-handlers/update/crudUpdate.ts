/**
 * @file Generic controller and service for updating existing documents with conflict resolution.
 * @filename crudUpdate.ts
 */

import type {CRUDRouteHandler} from "@shared/features/generic-crud/types";
import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/features/fetch-request-options/utils";
import type {CRUDRouteHandlerParams} from "@shared/features/generic-crud/types/CRUDRouteHandler";
import {isDuplicateIndexError} from "@shared/utility/mongoose/isDuplicateIndexError";
import {handleDuplicateIndexError} from "@shared/utility/mongoose/handleDuplicateIndexError";
import type {UpdateDocumentParams} from "@shared/features/generic-crud/path-handlers/update/crudUpdate.types";
import {DocumentVersionError} from "@shared/errors/DocumentVersionError";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";

/**
 * Manages document retrieval, mutation, and persistence with built-in retry logic for version conflicts.
 * @param params - Comprehensive update configuration including model, data, and retry settings.
 * @returns A promise resolving to the updated and re-hydrated document.
 */
export const updateDocument = async <TModel extends BaseModel>(
    params: UpdateDocumentParams<TModel>
): Promise<TModel> => {
    const {_id, model, data, unset, populatePaths, options, onDuplicateIndex, retries = 3} = params;

    try {
        const doc = await model.findById({_id}).orFail();

        doc.set(data);
        if (unset) Object.keys(unset).forEach(key => doc.set(key, undefined));

        await doc.save();

        const query = populateQuery({
            query: model.findById(_id),
            options: {...options, populatePaths},
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
 * Factory function that generates an Express controller for document updates.
 * @param params - Configuration including the model and optional relationship paths.
 * @returns An asynchronous Express controller function.
 */
export const update: CRUDRouteHandler = <TModel extends BaseModel>(
    {model, populatePaths}: CRUDRouteHandlerParams<TModel>
) => {
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
        });

        return res.status(200).json(item);
    }
}