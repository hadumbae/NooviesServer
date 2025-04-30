import {z, type ZodType} from 'zod';
import {RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {CoercedDateSchema} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {CountryEnum} from "../../../shared/schema/helpers/ZodEnumHelpers.js";

import type {IPersonSubmit} from "./interface/IPersonSubmit.js";

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