import type {CloudinaryImage} from "../types/CloudinaryImage.js";
import cloudinary from "../config/cloudinary.js";

export interface ICloudinaryUtils {
    upload(image: Express.Multer.File): Promise<CloudinaryImage>,
    delete(imageID: string): Promise<void>,
}

const CloudinaryUtils: ICloudinaryUtils = {
    async upload(image: Express.Multer.File): Promise<CloudinaryImage> {
        const imageBuffer = image.buffer;
        const imageArray = Array.from(new Uint8Array(imageBuffer));
        const imageData = Buffer.from(imageArray);

        const imageBase64 = imageData.toString('base64');
        return await cloudinary.uploader.upload(
            `data:image/png;base64,${imageBase64}`,
            { folder: 'propertypulse' },
        );
    },

    async delete(imageID: string): Promise<void> {
        await cloudinary.uploader.destroy(imageID);
    }
}

export default CloudinaryUtils;