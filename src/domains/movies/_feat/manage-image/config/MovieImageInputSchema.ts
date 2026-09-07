/**
 * @fileoverview Defines the schema and type for movie poster image uploads.
 */

import {z} from "zod";
import {MulterImageFileSchema} from "@/shared/_feat/manage-multer-images";

/** Zod validation schema for a movie poster image file input. */
export const MovieImageInputSchema = z.object({
    image: MulterImageFileSchema,
});

/** Data type for movie poster image inputs. */
export type MovieImageInputData = z.infer<typeof MovieImageInputSchema>;