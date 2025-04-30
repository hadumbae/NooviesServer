import {z, type ZodType} from 'zod';
import {RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import type IGenreSubmit from "./interface/IGenreSubmit.js";

export const GenreSubmitSchema: ZodType<IGenreSubmit> = z.object({
    name: RequiredStringSchema
        .min(3, "Must be 3 characters or longer.")
        .max(255, "Must be 255 characters or less."),

    description: RequiredStringSchema
        .min(1, "Required.")
        .max(1000, "Must be 1000 characters or less."),
});

export type ZGenreSubmit = z.infer<typeof GenreSubmitSchema>;
