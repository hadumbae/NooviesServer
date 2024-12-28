import {z, type ZodType} from 'zod';
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import type {IGenreSubmit} from "../model/GenreInterfaces.js";

export const GenreSubmitSchema: ZodType<IGenreSubmit> = z.object({
    name: RequiredString
        .min(3, "Must be 3 characters or longer.")
        .max(255, "Must be 255 characters or less."),

    description: RequiredString
        .max(1000, "Must be 1000 characters or less."),
});