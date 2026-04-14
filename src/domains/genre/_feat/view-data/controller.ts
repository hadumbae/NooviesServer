/**
 * @fileoverview Controller for aggregating Genre metadata and associated movie data.
 * Designed for administrative and detail views.
 */

import type {ControllerAsyncFunc} from "@shared/types/ControllerTypes";
import type {Request, Response} from "express";
import {fetchGenreDetails} from "./service";
import {fetchRequestOptions} from "@shared/_feat/fetch-request-options/utils";

/**
 * Retrieves a detailed view of a Genre, including paginated movie results.
 */
export const getFetchGenreDetailsVeiwData: ControllerAsyncFunc = async (
    req: Request, res: Response
) => {
    const {slug} = req.params;
    const {page, perPage} = fetchRequestOptions(req);

    const data = await fetchGenreDetails({
        genreSlug: slug,
        moviePagination: {page, perPage},
    });

    return res.status(200).json(data);
};