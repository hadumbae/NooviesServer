import { z } from "zod";
import ImageTypeConstant from "../../../../shared/constants/ImageTypeConstant.js";
import isMulterFile from "../../../../shared/utility/schema/file-upload/isMulterFile.js";

/**
 * Zod schema for validating a person's profile image upload.
 *
 * This schema validates an object with a single `file` property,
 * performing the following checks in `superRefine`:
 * 1. Ensures the file is present (`Required.`).
 * 2. Ensures the file is a valid Multer file object (`Invalid file.`).
 * 3. Ensures the file MIME type is allowed based on `ImageTypeConstant` (`Invalid file type.`).
 *
 * The validation is fatal, meaning that if any of these checks fail,
 * further validation is skipped.
 *
 * @example
 * ```ts
 * PersonProfileImageFileSchema.parse({ file: req.file });
 * ```
 *
 * @remarks
 * - The `file` object is expected to come from Multer middleware in an Express request.
 * - Only MIME types listed in `ImageTypeConstant` are accepted.
 */
export const PersonProfileImageFileSchema = z
    .object({ file: z.any() })
    .superRefine(({ file }, ctx) => {
        const code = "custom";
        const path = ["profileImage"];
        const fatal = true;

        if (!file) {
            ctx.addIssue({ code, path, fatal, message: "Required." });
            return z.NEVER;
        }

        if (!isMulterFile(file)) {
            ctx.addIssue({ code, path, fatal, message: "Invalid file." });
            return z.NEVER;
        }

        if (!ImageTypeConstant.includes(file.mimetype as any)) {
            ctx.addIssue({ code, path, fatal, message: "Invalid file type." });
            return z.NEVER;
        }
    });
