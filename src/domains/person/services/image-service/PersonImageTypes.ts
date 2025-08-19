import {Types} from "mongoose";


/**
 * Parameters required to upload or replace a person's profile image.
 */
export type UploadPersonProfileImageParams = {
    /**
     * The MongoDB ObjectId of the person whose profile image is being uploaded.
     */
    personId: Types.ObjectId;

    /**
     * The image file to upload. Expected to be a Multer-parsed file.
     */
    image: Express.Multer.File;
}

/**
 * Parameters required to remove a person's profile image.
 */
export type RemovePersonProfileImageParams = {
    /**
     * The MongoDB ObjectId of the person whose profile image is to be deleted.
     */
    personId: Types.ObjectId;
};