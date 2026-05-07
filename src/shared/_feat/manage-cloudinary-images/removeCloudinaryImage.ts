/**
 * @fileoverview Service function for removing an image from Cloudinary storage using its public ID.
 */

import cloudinary from "@config/cloudinary";

type RemoveImageConfig = {
    public_id: string;
};

/**
 * Deletes an image asset from Cloudinary using the provided public ID.
 */
export async function removeCloudinaryImage({public_id}: RemoveImageConfig): Promise<void> {
    await cloudinary.uploader.destroy(public_id);
}