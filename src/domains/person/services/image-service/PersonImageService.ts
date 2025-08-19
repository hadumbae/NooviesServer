import createHttpError from "http-errors";
import {type Document, Types} from "mongoose";
import type CloudinaryUtils from "../../../../shared/utility/CloudinaryUtils.js";

import PersonModel from "../../model/Person.model.js";
import type {IPerson} from "../../interfaces/IPerson.js";

import type {IPersonImageService} from "./IPersonImageService.js";
import type {RemovePersonProfileImageParams, UploadPersonProfileImageParams} from "./PersonImageTypes.js";

/**
 * Service for managing a person's profile image.
 * Provides functionality to fetch a person, update their profile image,
 * and delete their profile image from Cloudinary.
 */
export default class PersonImageService implements IPersonImageService {
    /** Cloudinary utility for uploading and deleting images */
    private cloudinaryUtils: Pick<CloudinaryUtils, "upload" | "delete">;

    /**
     * Creates a new instance of PersonImageService.
     * @param cloudinaryUtils - Cloudinary utility instance with `upload` and `delete` methods.
     */
    constructor({cloudinaryUtils}: {cloudinaryUtils: CloudinaryUtils}) {
        this.cloudinaryUtils = cloudinaryUtils;
    }

    /**
     * Fetches a person document by ID.
     * @param _id - The MongoDB ObjectId of the person.
     * @throws {HttpError} 404 if the person does not exist.
     * @returns The person document.
     */
    async fetchPerson(_id: Types.ObjectId): Promise<IPerson & Document> {
        const person = await PersonModel.findById(_id);
        if (!person) throw createHttpError(404, `Person with ID (${_id}) not found.`);
        return person;
    }

    /**
     * Updates a person's profile image.
     * Deletes the previous image from Cloudinary if it exists.
     * @param personId - The ID of the person.
     * @param image - The image file to upload.
     * @returns The updated person document including the new profile image.
     */
    async updateProfileImage({personId, image}: UploadPersonProfileImageParams): Promise<IPerson & Document> {
        const person = await this.fetchPerson(personId);

        if (person.profileImage) {
            await this.cloudinaryUtils.delete(person.profileImage.public_id);
        }

        person.profileImage = await this.cloudinaryUtils.upload(image);
        await person.save();

        return person;
    }

    /**
     * Deletes a person's profile image.
     * Removes the image from Cloudinary and clears the `profileImage` field.
     * @param personId - The ID of the person.
     * @returns The updated person document with `profileImage` set to null.
     */
    async deleteProfileImage({personId}: RemovePersonProfileImageParams): Promise<IPerson & Document> {
        const person = await this.fetchPerson(personId);

        if (person.profileImage) {
            await this.cloudinaryUtils.delete(person.profileImage.public_id);

            person.profileImage = null;
            await person.save();
        }

        return person;
    }
}