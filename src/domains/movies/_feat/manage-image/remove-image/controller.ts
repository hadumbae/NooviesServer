/**
 * @fileoverview Express controllers for removing movie poster and banner images.
 */

import type {Request, Response} from "express";
import type {ManageMovieImageRouteConfig} from "@/domains/movies/_feat/manage-image/config";
import {
    removeMovieBannerImage,
    removeMoviePosterImage
} from "@/domains/movies/_feat/manage-image/remove-image/removers";

/** Express controller that handles deleting a movie's poster image. */
export async function patchRemoveMoviePosterImage(req: Request, res: Response): Promise<Response> {
    const {_id} = req.parsedConfig as ManageMovieImageRouteConfig;

    const movie = await removeMoviePosterImage({movieID: _id});
    return res.status(200).json(movie);
}

/** Express controller that handles deleting a movie's banner image. */
export async function patchRemoveMovieBannerImage(req: Request, res: Response): Promise<Response> {
    const {_id} = req.parsedConfig as ManageMovieImageRouteConfig;
    console.log("ID: ", _id);

    const movie = await removeMovieBannerImage({movieID: _id});
    return res.status(200).json(movie);
}