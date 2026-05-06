/**
 * @fileoverview Zod schema for validating the MIME type of a Multer-uploaded image file.
 */

import {z} from "zod";
import {StringValueSchema} from "@shared/schema/strings/StringValueSchema";

/**
 * Zod schema to validate that the provided file MIME type starts with the "image/" prefix.
 */
export const MulterImageFileMimeTypeSchema = StringValueSchema.regex(/^image\//);

/**
 * Inferred TypeScript type for the validated Multer image file MIME type.
 */
export type MulterImageFileMimeType = z.infer<typeof MulterImageFileMimeTypeSchema>;