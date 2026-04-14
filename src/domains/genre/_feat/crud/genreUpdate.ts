/**
 * @fileoverview Express handler for updating an existing Genre.
 */

import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/_feat/fetch-request-options/utils";
import isValidObjectId from "@shared/utility/mongoose/isValidObjectId";
import {updateDocument} from "@shared/_feat/generic-crud/path-handlers";
import {Genre, handleGenreDuplicateIndex} from "@domains/genre/models/genre";

/**
 * Updates a Genre document by ID, handling field synchronization and unsetting.
 */
export function genreUpdate() {
    return async (req: Request, res: Response) => {
        const itemID = isValidObjectId(req.params._id);
        const options = fetchRequestOptions(req);

        const data = req.validatedBody;
        const unset = req.unsetFields;

        const item = await updateDocument({
            model: Genre,
            _id: itemID,
            options,
            data,
            unset,
            onDuplicateIndex: handleGenreDuplicateIndex,
        });

        return res.status(200).json(item);
    };
}