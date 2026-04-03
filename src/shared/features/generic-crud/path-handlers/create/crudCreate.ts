/**
 * @file Generic controller and service for creating new documents within a Mongoose model.
 * @filename crudCreate.ts
 */

import type {CRUDRouteHandler} from "@shared/features/generic-crud/types";
import populateQuery from "@shared/utility/mongoose/populateQuery";
import type {BaseModel} from "@shared/types/schema/BaseModel";
import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/features/fetch-request-options/utils";
import type {CreateDocumentParams} from "@shared/features/generic-crud/path-handlers/create/crudCreate.types";
import {isDuplicateIndexError} from "@shared/utility/mongoose/isDuplicateIndexError";
import {handleDuplicateIndexError} from "@shared/utility/mongoose/handleDuplicateIndexError";

/**
 * Orchestrates document instantiation, persistence, and post-creation enrichment.
 * @param params - Configuration including model, input data, and error handlers.
 * @returns A promise resolving to the fully hydrated and populated document.
 */
export const createDocument = async <TModel extends BaseModel>(
    {model, data, populatePaths, options, onDuplicateIndex}: CreateDocumentParams<TModel>
): Promise<TModel> => {
    try {
        const newDoc = new model(data);
        const doc = await newDoc.save();

        const query = populateQuery({
            query: model.findById(doc._id),
            options: {...options, populatePaths},
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
 * Factory function that generates an Express controller for document creation.
 * @param params - Configuration including the model and optional relationship paths.
 * @returns An asynchronous Express controller function.
 */
export const create: CRUDRouteHandler<BaseModel> = ({model, populatePaths}) => {
    return async (req: Request, res: Response) => {
        const options = fetchRequestOptions(req);
        const data = req.validatedBody;

        const item = await createDocument({
            model,
            options,
            data,
            populatePaths,
        });

        return res.status(200).json(item);
    }
}