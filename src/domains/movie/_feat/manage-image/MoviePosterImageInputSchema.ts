/**
 * @fileoverview Defines the schema and type for movie poster image uploads.
 */

import { MulterImageFileSchema } from "@shared/_feat/manage-multer-images";
import {z} from "zod";

/** Zod validation schema for a movie poster image file input. */
export const MoviePosterImageInputSchema = z.object({
    image: MulterImageFileSchema,
});

/** Data type for movie poster image inputs. */
export type MoviePosterImageInputData = z.infer<typeof MoviePosterImageInputSchema>;