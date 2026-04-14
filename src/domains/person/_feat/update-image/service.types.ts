/**
 * @fileoverview Type definitions for Person profile image operations.
 * Defines configurations for uploading and removing image assets.
 */

import {Types} from "mongoose";

/**
 * Parameters for uploading or replacing a person's profile image.
 */
export type UploadPersonProfileImageConfig = {
    _id: Types.ObjectId;
    image: Express.Multer.File;
};

/**
 * Parameters for removing an existing profile image from a person's record.
 */
export type RemovePersonProfileImageConfig = {
    _id: Types.ObjectId;
};