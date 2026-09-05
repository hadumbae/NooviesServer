/**
 * @fileoverview Service function for removing an image from Cloudinary storage using its public ID.
 */

import {Cloudinary} from "@/shared/config/cloudinary";

type RemoveImageConfig = {
    public_id: string;
};

/**
 * Deletes an image asset from Cloudinary using the provided public ID.
 */
export async function removeCloudinaryImage({public_id}: RemoveImageConfig): Promise<void> {
    await Cloudinary.uploader.destroy(public_id);
}