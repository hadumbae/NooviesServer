/**
 * @fileoverview Type definitions for the movie poster image management service.
 */

import {Types} from "mongoose";
import type {MulterImageFile} from "@shared/_feat/manage-multer-images";

/** Configuration for uploading a movie poster image. */
export type UploadPosterImageConfig = {
    movieID: Types.ObjectId;
    image: MulterImageFile;
}

/** Configuration for deleting a movie poster image. */
export type DeletePosterImageConfig = {
    movieID: Types.ObjectId
}
