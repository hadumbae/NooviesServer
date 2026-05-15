/**
 * @fileoverview Express controllers for managing movie poster image updates and removals.
 */

import type {Request, Response} from "express";
import type {
    ManageMoviePosterImageRouteConfig
} from "@domains/movie/_feat/manage-image/ManageMoviePosterImageRouteConfigSchema";
import type {MoviePosterImageInputData} from "./MoviePosterImageInputSchema";
import {removeMoviePosterImage, updateMoviePosterImage} from "@domains/movie/_feat/manage-image/service";

/** Updates the poster image for a specific movie. */
export async function patchUpdateMoviePosterImage(req: Request, res: Response): Promise<Response> {
    const {_id} = req.parsedConfig as ManageMoviePosterImageRouteConfig;
    const {image} = req.validatedBody as MoviePosterImageInputData;

    const movie = await updateMoviePosterImage({movieID: _id, image});
    return res.status(200).json(movie);
}

/** Removes the poster image from a specific movie. */
export async function patchRemoveMoviePosterImage(req: Request, res: Response): Promise<Response> {
    const {_id} = req.parsedConfig as ManageMoviePosterImageRouteConfig;

    const movie = await removeMoviePosterImage({movieID: _id});
    return res.status(200).json(movie);
}