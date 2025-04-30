import {z, type ZodType} from 'zod';
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {MovieSchema} from "../../movie/schema/MovieSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {CoercedDateSchema} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {CountryEnum} from "../../../shared/schema/helpers/ZodEnumHelpers.js";
import {CloudinaryImageObject} from "../../../shared/schema/helpers/ZodImageHelpers.js";
import type {IPerson} from "../model/IPerson.js";

export const PersonSchema: ZodType<IPerson> = z.object({
    _id: IDInstance.readonly(),

    name: RequiredStringSchema
        .min(3, "Must be at least 3 characters.")
        .max(255, "Name must not be more than 255 characters."),

    biography: RequiredStringSchema
        .min(1, "Required.")
        .max(1000, "Must be 1000 characters or less."),

    dob: CoercedDateSchema,

    nationality: CountryEnum,

    profileImage: z
        .union([z.null(), CloudinaryImageObject.readonly()])
        .optional(),

    movies: z
        .array(z.union([IDInstance, z.lazy(() => MovieSchema) ])),
});

export type ZPerson = z.infer<typeof PersonSchema>;