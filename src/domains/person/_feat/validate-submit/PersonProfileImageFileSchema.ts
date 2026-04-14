/**
 * @fileoverview Zod schema for validating Person profile image file uploads.
 * Ensures the presence of a file and validates its Multer structure and MIME type.
 */

import {z} from "zod";
import ImageTypeConstant from "@shared/constants/ImageTypeConstant";
import isMulterFile from "@shared/utility/schema/file-upload/isMulterFile";

/**
 * Validates that an uploaded file is a valid image processed by Multer.
 */
export const PersonProfileImageFileSchema = z
    .object({file: z.any()})
    .superRefine(({file}, ctx) => {
        const code = "custom";
        const path = ["profileImage"];
        const fatal = true;

        if (!file) {
            ctx.addIssue({code, path, fatal, message: "Required."});
            return z.NEVER;
        }

        if (!isMulterFile(file)) {
            ctx.addIssue({code, path, fatal, message: "Invalid file."});
            return z.NEVER;
        }

        if (!ImageTypeConstant.includes(file.mimetype as any)) {
            ctx.addIssue({code, path, fatal, message: "Invalid file type."});
            return z.NEVER;
        }
    });

/**
 * Type representing the validated profile image file data.
 */
export type PersonProfileImageFileData = z.infer<typeof PersonProfileImageFileSchema>;