/**
 * @fileoverview Zod schema for validating that an incoming Multer file payload is an instance of a Buffer.
 */

import {z} from "zod";

/**
 * Zod schema to validate that the provided data is an instance of a Node.js Buffer,
 * typically used for processing uploaded files in a Multer middleware pipeline.
 */
export const MulterImageFileBufferSchema = z.instanceof(Buffer, {message: "Expected a Buffer"});

/**
 * Inferred TypeScript type for the validated Multer image file buffer.
 */
export type MulterImageFileBuffer = z.infer<typeof MulterImageFileBufferSchema>;