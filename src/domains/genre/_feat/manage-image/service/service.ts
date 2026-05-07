/**
 * @fileoverview Service for managing genre images via Cloudinary and database updates.
 */

import type {
    RemoveGenreImageConfig,
    UpdateGenreImageConfig
} from "@domains/genre/_feat/manage-image/service/service.types";
import {Genre, type GenreSchemaFields} from "@domains/genre/models/genre";
import createHttpError from "http-errors";
import {removeCloudinaryImage, uploadCloudinaryImage} from "@shared/_feat/manage-cloudinary-images";

/** Updates a genre's image in Cloudinary and the database. */
export async function updateGenreImage(
    {_id, image}: UpdateGenreImageConfig
): Promise<GenreSchemaFields> {
    const genre = await Genre.findById(_id);
    if (!genre) throw createHttpError(404, "Genre not found.")

    if (genre.image) {
        await removeCloudinaryImage({public_id: genre.image.public_id});
    }

    console.log("Buffer: ", image.buffer)

    genre.image = await uploadCloudinaryImage({image: image as Express.Multer.File});
    await genre.save();

    return genre;
}

/** Removes a genre's image from Cloudinary and the database. */
export async function removeGenreImage(
    {_id}: RemoveGenreImageConfig
): Promise<GenreSchemaFields> {
    const genre = await Genre.findById(_id);
    if (!genre) throw createHttpError(404, "Genre not found.")

    if (genre.image) {
        await removeCloudinaryImage({public_id: genre.image.public_id});
        genre.image = null;
        await genre.save();
    }

    return genre;
}