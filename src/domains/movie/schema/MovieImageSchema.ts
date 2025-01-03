import {z} from "zod";
import {isMulterFile} from "../../../shared/utility/zod/TypeChecks.js";
import ImageTypeConstant from "../../../shared/constants/ImageTypeConstant.js";

export const MovieImageSchema = z.object({
    file: z.any(),
}).superRefine(({file}, ctx) => {
    if (!file) {
        ctx.addIssue({code: "custom", path: ['image'], message: "Required.", fatal: true});
        return z.NEVER;
    }

    if (!isMulterFile(file)) {
        ctx.addIssue({code: "custom", path: ['image'], message: "Invalid file.", fatal: true});
        return z.NEVER;
    }

    if (!ImageTypeConstant.includes(file.mimetype as any)) {
        ctx.addIssue({code: "custom", path: ['image'], message: "Invalid file type.", fatal: true});
        return z.NEVER;
    }
});