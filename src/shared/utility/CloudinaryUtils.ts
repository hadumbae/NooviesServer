import cloudinary from "../config/cloudinary.js";
import ZodParseError from "../errors/ZodParseError.js";
import {type CloudinaryImageObject, CloudinaryImageObjectSchema} from "../schema/cloudinary/CloudinaryImageObjectSchema.js";

/**
 * Interface defining the Cloudinary utility methods.
 */
export interface ICloudinaryUtils {
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

/**
 * Cloudinary utility implementation for uploading and deleting images.
 */
const CloudinaryUtils: ICloudinaryUtils = {
    async upload(image: Express.Multer.File): Promise<CloudinaryImageObject> {
        // Convert buffer to base64
        const imageBuffer = image.buffer;
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);
        const imageBase64 = imageData.toString('base64');

        const uploadFile = `data:image/png;base64,${imageBase64}`;
        const uploadOptions = {folder: 'propertypulse'};
        const response = await cloudinary.uploader.upload(uploadFile, uploadOptions);

        // Validate the Cloudinary response
        const {error, success, data} = CloudinaryImageObjectSchema.safeParse(response);

        if (!success) {
            const message = "Invalid return from Cloudinary. Please check image data and try again.";
            throw new ZodParseError({message, errors: error?.errors});
        }

        return data!;
    },

    async delete(imageID: string): Promise<void> {
        // Delete image by ID
        await cloudinary.uploader.destroy(imageID);
    }
};

export default CloudinaryUtils;
