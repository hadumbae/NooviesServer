/**
 * @fileoverview Express controllers for updating movie poster and banner images.
 */

import type {Request, Response} from "express";
import type {ManageMovieImageRouteConfig, MovieImageInputData} from "@/domains/movies/_feat/manage-image/config";
import {
    updateMovieBannerImage,
    updateMoviePosterImage
} from "@/domains/movies/_feat/manage-image/update-image/updaters";

/** Express controller that handles updating a movie's poster image. */
export async function patchUpdateMoviePoster(req: Request, res: Response): Promise<Response> {
    const {_id} = req.parsedConfig as ManageMovieImageRouteConfig;
    const {image} = req.validatedBody as MovieImageInputData;

    const movie = await updateMoviePosterImage({movieID: _id, image});
    return res.status(200).json(movie);
}

/** Express controller that handles updating a movie's banner image. */
export async function patchUpdateMovieBanner(req: Request, res: Response): Promise<Response> {
    const {_id} = req.parsedConfig as ManageMovieImageRouteConfig;
    const {image} = req.validatedBody as MovieImageInputData;

    const movie = await updateMovieBannerImage({movieID: _id, image});
    return res.status(200).json(movie);
}