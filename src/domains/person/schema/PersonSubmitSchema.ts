import {z, type ZodType} from 'zod';
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {CoercedDate} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {CountryEnum} from "../../../shared/schema/helpers/ZodEnumHelpers.js";

import type {IPersonSubmit} from "./interface/IPersonSubmit.js";
import {PersonAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";

export const PersonSubmitSchema: ZodType<IPersonSubmit> = z.object({
    name: RequiredString
        .min(3, "Must be at least 3 characters.")
        .max(255, "Name must not be more than 255 characters."),

    biography: RequiredString
        .min(1, "Required.")
        .max(1000, "Must be 1000 characters or less."),

    dob: CoercedDate,

    nationality: CountryEnum,

    directors: z.array(PersonAsyncIDString),

    cast: z.array(PersonAsyncIDString),
});