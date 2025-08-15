import {type Document, Types} from "mongoose";
import type {IPerson} from "../../interfaces/IPerson.js";
import type {ZPerson} from "../../schema/PersonSchema.js";
import type {
    RemovePersonProfileImageParams,
    UploadPersonProfileImageParams
} from "./PersonImageTypes.js";

/**
 * Interface for services that manage a person's profile image.
 *
 * Provides methods to fetch a person by ID, upload a new profile image,
 * and delete an existing profile image.
 */
export interface IPersonImageService {
    /**
     * Retrieves a person document by their MongoDB ObjectId.
     *
     * @param _id - The ObjectId of the person to retrieve.
     * @returns A promise resolving to the matching person document.
     */
    fetchPerson(_id: Types.ObjectId): Promise<IPerson & Document>;

    /**
     * Uploads or replaces a person's profile image.
     * Deletes any existing image before uploading a new one.
     *
     * @param params - The parameters including the person ID and image file.
     * @returns A promise resolving to the updated person object.
     */
    updateProfileImage(params: UploadPersonProfileImageParams): Promise<ZPerson>;

    /**
     * Deletes a person's existing profile image, if one exists.
     *
     * @param params - The parameters including the person ID.
     * @returns A promise resolving to the updated person object with no image.
     */
    deleteProfileImage(params: RemovePersonProfileImageParams): Promise<ZPerson>;
}