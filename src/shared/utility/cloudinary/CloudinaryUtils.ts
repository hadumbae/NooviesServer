import cloudinary from "@config/cloudinary.js";
import ZodParseError from "../../errors/ZodParseError.js";
import type {CloudinaryUtilsMethods} from "./CloudinaryUtils.types.js";
import {
    type CloudinaryImageObject,
    CloudinaryImageObjectSchema
} from "../../schema/cloudinary/CloudinaryImageObjectSchema.js";

/**
 * Cloudinary utility implementation for uploading and deleting images.
 */
const CloudinaryUtils: CloudinaryUtilsMethods = {
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
