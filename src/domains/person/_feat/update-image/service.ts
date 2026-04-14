/**
 * @fileoverview Service layer for managing Person profile images via Cloudinary.
 * Handles both the replacement and removal of image assets.
 */

import type {DocumentType} from "@shared/types/mongoose/DocumentType";
import type {
    RemovePersonProfileImageConfig,
    UploadPersonProfileImageConfig
} from "@domains/person/_feat/update-image/service.types";
import createHttpError from "http-errors";
import CloudinaryUtils from "@shared/utility/cloudinary/CloudinaryUtils";
import {Person, type PersonSchemaFields} from "@domains/person/model";

/**
 * Uploads a new profile image for a person.
 * Automatically cleans up the previous image from Cloudinary if it exists.
 */
export async function updateProfileImage(
    {_id, image}: UploadPersonProfileImageConfig
): Promise<DocumentType<PersonSchemaFields>> {
    const person = await Person.findById(_id);
    if (!person) throw createHttpError(404, "Person not found.");

    // Clean up existing asset
    if (person.profileImage?.public_id) {
        await CloudinaryUtils.delete(person.profileImage.public_id);
    }

    person.profileImage = await CloudinaryUtils.upload(image);
    await person.save();

    return person;
}

/**
 * Removes the profile image associated with a person.
 * Deletes the asset from Cloudinary and sets the local field to null.
 */
export async function deleteProfileImage(
    {_id}: RemovePersonProfileImageConfig
): Promise<DocumentType<PersonSchemaFields>> {
    const person = await Person.findById(_id);
    if (!person) throw createHttpError(404, "Person not found.");

    if (person.profileImage?.public_id) {
        await CloudinaryUtils.delete(person.profileImage.public_id);

        person.profileImage = null;
        await person.save();
    }

    return person;
}