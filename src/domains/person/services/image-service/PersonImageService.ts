import createHttpError from "http-errors";
import {type Document, Types} from "mongoose";
import type CloudinaryUtils from "../../../../shared/utility/CloudinaryUtils.js";

import Person from "../../model/Person.js";
import type {IPerson} from "../../model/IPerson.js";
import type {ZPerson} from "../../schema/PersonSchema.js";

import type {IPersonImageService} from "./IPersonImageService.js";
import type {RemovePersonProfileImageParams, UploadPersonProfileImageParams} from "./PersonImageTypes.js";

/**
 * A service class responsible for managing person profile images,
 * including uploading new images, replacing existing ones, and deleting images.
 */
export default class PersonImageService implements IPersonImageService {
    private cloudinaryUtils: CloudinaryUtils;

    /**
     * Constructs a new instance of {@link PersonImageService}.
     *
     * @param cloudinaryUtils - An instance of CloudinaryUtils to handle image uploads and deletions.
     */
    constructor({cloudinaryUtils}: {cloudinaryUtils: CloudinaryUtils}) {
        this.cloudinaryUtils = cloudinaryUtils;
    }

    /**
     * Fetches a person document by its ObjectId.
     *
     * @param _id - The MongoDB ObjectId of the person to retrieve.
     * @returns The person document if found.
     * @throws 404 Not Found error if the person does not exist.
     */
    async fetchPerson(_id: Types.ObjectId): Promise<IPerson & Document> {
        const person = await Person.findById(_id);
        if (!person) throw createHttpError(404, "Not found.");
        return person;
    }

    /**
     * Updates a person's profile image. If an image already exists,
     * it is removed from Cloudinary before uploading the new one.
     *
     * @param personID - The ID of the person to update.
     * @param image - The image file to upload.
     * @returns The updated person as a {@link ZPerson} object.
     */
    async updateProfileImage({personID, image}: UploadPersonProfileImageParams): Promise<ZPerson> {
        const person = await this.fetchPerson(personID);

        if (person.profileImage) {
            await this.cloudinaryUtils.delete(person.profileImage.public_id);
        }

        person.profileImage = await this.cloudinaryUtils.upload(image);
        await person.save();

        return person;
    }

    /**
     * Deletes a person's existing profile image from both the database and Cloudinary.
     *
     * @param personID - The ID of the person whose image should be deleted.
     * @returns The updated person with the profile image set to `null`, as a {@link ZPerson} object.
     */
    async deleteProfileImage({personID}: RemovePersonProfileImageParams): Promise<ZPerson> {
        const person = await this.fetchPerson(personID);

        if (person.profileImage) {
            await this.cloudinaryUtils.delete(person.profileImage.public_id);

            person.profileImage = null;
            await person.save();
        }

        return person;
    }
}