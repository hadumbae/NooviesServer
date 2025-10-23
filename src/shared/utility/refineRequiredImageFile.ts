import { type RefinementCtx, z } from "zod";
import ImageTypeConstant from "../constants/ImageTypeConstant.js";
import isMulterFile from "./schema/file-upload/isMulterFile.js";

/**
 * Parameters for `refineRequiredImageFile`.
 */
type RefinementParams = {
    /** The key of the object property to validate (e.g., "profileImage"). */
    pathName: string;
};

/**
 * Minimal object type for refinement. Must include an optional `file` property.
 */
type RefinementFileObject = {
    /** The file to validate; typically comes from a file upload. */
    file?: unknown;
};

/**
 * Factory function that creates a Zod `superRefine` function to validate required image files.
 *
 * @template TObject - The type of object being refined; must include an optional `file` property.
 * @param {RefinementParams} params - Configuration for the refinement function.
 * @param {string} params.pathName - The object key representing the file field.
 * @returns {(values: TObject, ctx: RefinementCtx) => void} - A `superRefine` function usable in Zod schemas.
 *
 * @remarks
 * The returned function will:
 * 1. Check that the `file` exists; if not, adds a required-field issue.
 * 2. Check that the `file` is a valid Multer file using `isMulterFile`; if not, adds an invalid-type issue.
 * 3. Check that the `file` mimetype is included in `ImageTypeConstant`; if not, adds an invalid-type issue.
 *
 * @example
 * ```ts
 * const userSchema = z.object({
 *   profileImage: z.any().superRefine(refineRequiredImageFile({ pathName: "profileImage" }))
 * });
 * ```
 */
export default function refineRequiredImageFile<TObject extends RefinementFileObject>(
    params: RefinementParams
) {
    const { pathName } = params;
    const path = [pathName];

    return (values: TObject, ctx: RefinementCtx) => {
        const { file } = values;

        const fatal = true;
        const code = "custom";

        if (!file) {
            ctx.addIssue({ code, path, fatal, message: "Required." });
            return z.NEVER;
        }

        if (!isMulterFile(file)) {
            ctx.addIssue({ code, path, fatal, message: "Invalid file." });
            return z.NEVER;
        }

        if (!ImageTypeConstant.includes((file as any).mimetype)) {
            ctx.addIssue({ code, path, fatal, message: "Invalid file type." });
            return z.NEVER;
        }
    };
}
