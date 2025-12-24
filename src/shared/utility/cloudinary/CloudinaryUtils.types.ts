import type {CloudinaryImageObject} from "../../schema/cloudinary/CloudinaryImageObjectSchema.js";

/**
 * Interface defining the Cloudinary utility methods.
 */
export interface CloudinaryUtils {
    /**
     * Uploads an image file to Cloudinary.
     *
     * Converts the image buffer to a base64 string and uploads it to the configured Cloudinary folder.
     * Validates the response against {@link CloudinaryImageObjectSchema}.
     *
     * @param image - The image file to upload (from `Express.Multer.File`).
     * @returns A validated {@link CloudinaryImageObject} representing the uploaded image.
     * @throws {ZodParseError} When the response from Cloudinary does not match the expected schema.
     */
    upload(image: Express.Multer.File): Promise<CloudinaryImageObject>;

    /**
     * Deletes an image from Cloudinary by its public ID.
     *
     * @param imageID - The public ID of the image to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(imageID: string): Promise<void>;
}