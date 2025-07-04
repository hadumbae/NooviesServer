import cloudinary from "../config/cloudinary.js";

import ZodParseError from "../errors/ZodParseError.js";

import {
    type CloudinaryImageObject,
    CloudinaryImageObjectSchema
} from "../schema/cloudinary/CloudinaryImageObjectSchema.js";

export interface ICloudinaryUtils {
    upload(image: Express.Multer.File): Promise<CloudinaryImageObject>,

    delete(imageID: string): Promise<void>,
}

export default class CloudinaryUtils implements ICloudinaryUtils {
    constructor(private cloudinaryInstance: typeof cloudinary = cloudinary) {
    }

    async upload(image: Express.Multer.File): Promise<CloudinaryImageObject> {
        const imageBuffer = image.buffer;
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);
        const imageBase64 = imageData.toString('base64');

        const uploadFile = `data:image/png;base64,${imageBase64}`;
        const uploadOptions = {folder: 'propertypulse'};
        const response = await this.cloudinaryInstance.uploader.upload(uploadFile, uploadOptions);

        const {error, success, data} = CloudinaryImageObjectSchema.safeParse(response);

        if (!success) {
            const message = "Invalid return from Cloudinary. Please check image data and try again.";
            throw new ZodParseError({message, errors: error?.errors});
        }

        return data!;
    }

    async delete(imageID: string): Promise<void> {
        await this.cloudinaryInstance.uploader.destroy(imageID);
    }
}