/**
 * @fileoverview Type definitions for configuring the update and removal operations of a genre image.
 */

import {Types} from "mongoose";
import type {MulterImageFile} from "@shared/_feat/manage-multer-images";

/**
 * Configuration object required for updating a genre image.
 */
export type UpdateGenreImageConfig = {
    _id: Types.ObjectId;
    image: MulterImageFile;
};

/**
 * Configuration object required for removing a genre image.
 */
export type RemoveGenreImageConfig = {
    _id: Types.ObjectId;
};
