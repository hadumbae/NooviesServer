import {z} from "zod";
import {isMulterFile} from "../../../../shared/utility/zod/TypeChecks.js";
import ImageTypeConstant from "../../../../shared/constants/ImageTypeConstant.js";

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