import createHttpError from "http-errors";
import {type Document, Types} from "mongoose";

import PersonModel from "../../model/Person.model.js";
import type {PersonSchemaFields} from "../../interfaces/PersonSchemaFields.js";

import type {IPersonImageService} from "./IPersonImageService.js";
import type {RemovePersonProfileImageParams, UploadPersonProfileImageParams} from "./PersonImageTypes.js";
import CloudinaryUtils from "../../../../shared/utility/cloudinary/CloudinaryUtils.js";

/**
 * Service for managing a person's profile image.
 * Provides functionality to fetch a person, update their profile image,
 * and delete their profile image from Cloudinary.
 */
export default class PersonImageService implements IPersonImageService {
    /**
     * Fetches a person document by ID.
     * @param _id - The MongoDB ObjectId of the person.
     * @throws {HttpError} 404 if the person does not exist.
     * @returns The person document.
     */
    async fetchPerson(_id: Types.ObjectId): Promise<PersonSchemaFields & Document> {
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
    async updateProfileImage({personId, image}: UploadPersonProfileImageParams): Promise<PersonSchemaFields & Document> {
        const person = await this.fetchPerson(personId);

        if (person.profileImage) {
            await CloudinaryUtils.delete(person.profileImage.public_id);
        }

        person.profileImage = await CloudinaryUtils.upload(image);
        await person.save();

        return person;
    }

    /**
     * Deletes a person's profile image.
     * Removes the image from Cloudinary and clears the `profileImage` field.
     * @param personId - The ID of the person.
     * @returns The updated person document with `profileImage` set to null.
     */
    async deleteProfileImage({personId}: RemovePersonProfileImageParams): Promise<PersonSchemaFields & Document> {
        const person = await this.fetchPerson(personId);

        if (person.profileImage) {
            await CloudinaryUtils.delete(person.profileImage.public_id);

            person.profileImage = null;
            await person.save();
        }

        return person;
    }
}