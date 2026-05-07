/**
 * @fileoverview Zod schema defining the input shape for a genre image upload, containing the Multer-processed image file.
 */

import {z} from "zod";
import {MulterImageFileSchema} from "@shared/_feat/manage-multer-images";

/**
 * Zod schema for validating the incoming payload when uploading a genre image.
 */
export const GenreImageInputSchema = z.object({
    image: MulterImageFileSchema,
});

/**
 * Inferred TypeScript type for the validated genre image input data.
 */
export type GenreImageInputData = z.infer<typeof GenreImageInputSchema>;