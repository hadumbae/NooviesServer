import {z, type ZodType} from 'zod';

import type {IPersonSubmit} from "./interface/IPersonSubmit.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {ISO3166Alpha2CodeEnumSchema} from "../../../shared/schema/enums/country/ISO3166Alpha2CodeEnumSchema.js";
import {DateStringSchema} from "../../../shared/schema/date/DateStringSchema.js";

export const PersonSubmitSchema: ZodType<IPersonSubmit> = z.object({
    name: RequiredStringSchema
        .min(3, "Must be at least 3 characters.")
        .max(255, "Name must not be more than 255 characters."),

    biography: RequiredStringSchema
        .min(1, "Required.")
        .max(1000, "Must be 1000 characters or less."),

    dob: DateStringSchema,

    nationality: ISO3166Alpha2CodeEnumSchema,
});