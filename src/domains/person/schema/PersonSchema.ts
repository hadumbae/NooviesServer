import {z, type ZodType} from 'zod';
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import type {IPerson} from "../model/IPerson.js";
import {MovieCreditSchema} from "../../movieCredit/schemas/MovieCreditSchema.js";
import {ISO3166Alpha2CodeEnumSchema} from "../../../shared/schema/enums/country/ISO3166Alpha2CodeEnumSchema.js";
import {DateStringSchema} from "../../../shared/schema/date/DateStringSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {CloudinaryImageObjectSchema} from "../../../shared/schema/cloudinary/CloudinaryImageObjectSchema.js";

export const PersonSchema: ZodType<IPerson> = z.object({
    _id: IDInstance.readonly(),

    name: RequiredStringSchema
        .min(3, "Must be at least 3 characters.")
        .max(255, "Name must not be more than 255 characters."),

    biography: RequiredStringSchema
        .min(1, "Required.")
        .max(1000, "Must be 1000 characters or less."),

    dob: DateStringSchema,

    nationality: ISO3166Alpha2CodeEnumSchema,

    profileImage: z
        .union([z.null(), CloudinaryImageObjectSchema.readonly()])
        .optional(),

    movies: z.array(z.lazy(() => MovieCreditSchema), {message: "Must be an array of movie credits."}).optional(),
});

export type ZPerson = z.infer<typeof PersonSchema>;