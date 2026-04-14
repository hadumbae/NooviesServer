/**
 * @fileoverview Express handler for creating a new Genre.
 */

import type {Request, Response} from "express";
import {fetchRequestOptions} from "@shared/_feat/fetch-request-options/utils";
import {createDocument} from "@shared/_feat/generic-crud/path-handlers";
import {Genre, handleGenreDuplicateIndex} from "@domains/genre/models/genre";

/**
 * Creates a Genre document using validated body data and domain-specific error handling.
 */
export function genreCreate() {
    return async (req: Request, res: Response) => {
        const options = fetchRequestOptions(req);
        const data = req.validatedBody;

        const item = await createDocument({
            model: Genre,
            options,
            data,
            onDuplicateIndex: handleGenreDuplicateIndex,
        });

        return res.status(200).json(item);
    };
}