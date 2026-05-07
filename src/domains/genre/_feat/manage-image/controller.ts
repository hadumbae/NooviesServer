/**
 * @fileoverview Express controllers for managing genre image updates and removals.
 */
import type {Request, Response} from "express";
import type {ManageGenreImageRouteConfig} from "@domains/genre/_feat/manage-image/schema/ManageGenreImageRouteConfig";
import type {GenreImageInputData} from "@domains/genre/_feat/manage-image/schema/GenreImageInputSchema";
import {removeGenreImage, updateGenreImage} from "@domains/genre/_feat/manage-image/service/service";

/** Updates the image associated with a specific genre. */
export async function patchUpdateGenreImage(req: Request, res: Response): Promise<Response> {
    const {_id} = req.parsedConfig as ManageGenreImageRouteConfig;
    const {image} = req.validatedBody as GenreImageInputData;

    const genre = await updateGenreImage({_id, image});
    return res.status(200).json(genre);
}

/** Removes the image associated with a specific genre. */
export async function patchRemoveGenreImage(req: Request, res: Response): Promise<Response> {
    const {_id} = req.parsedConfig as ManageGenreImageRouteConfig;

    const genre = await removeGenreImage({_id});
    return res.status(200).json(genre);
}

