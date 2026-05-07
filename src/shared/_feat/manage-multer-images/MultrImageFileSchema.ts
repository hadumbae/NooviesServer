/**
 * @fileoverview Zod schema for validating the structure of an uploaded image file processed by Multer.
 */

import {z} from "zod";
import {StringValueSchema} from "@shared/schema/strings/StringValueSchema";
import {PositiveIntegerSchema} from "@shared/schema/numbers/PositiveIntegerSchema";
import {MulterImageFileMimeTypeSchema} from "./MulterImageFileMimeTypeSchema";
import {MulterImageFileBufferSchema} from "@shared/_feat/manage-multer-images/MulterImageFileBufferSchema";

/**
 * Zod schema defining the structure of an uploaded image file,
 * including field name, original filename, encoding, MIME type, file size, and binary buffer.
 */
export const MulterImageFileSchema = z.object({
    fieldname: StringValueSchema,
    originalname: StringValueSchema,
    encoding: StringValueSchema,
    mimetype: MulterImageFileMimeTypeSchema,
    size: PositiveIntegerSchema,
    buffer: MulterImageFileBufferSchema,
});

/**
 * Inferred TypeScript type for the validated Multer image file object.
 */
export type MulterImageFile = z.infer<typeof MulterImageFileSchema>;