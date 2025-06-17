import {z, type ZodType} from 'zod';
import {CountryEnum} from "../../../shared/schema/helpers/ZodEnumHelpers.js";

import type {IPersonSubmit} from "./interface/IPersonSubmit.js";
import {CoercedDateSchema} from "../../../shared/schema/date/CoercedDateSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";

export const PersonSubmitSchema: ZodType<IPersonSubmit> = z.object({
    name: RequiredStringSchema
        .min(3, "Must be at least 3 characters.")
        .max(255, "Name must not be more than 255 characters."),

    biography: RequiredStringSchema
        .min(1, "Required.")
        .max(1000, "Must be 1000 characters or less."),

    dob: CoercedDateSchema,

    nationality: CountryEnum,
});