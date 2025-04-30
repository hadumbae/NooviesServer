import {z, type ZodType} from "zod";
import {ObjectIdStringSchema, RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {CoercedDateSchema} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {RequiredBoolean} from "../../../shared/schema/helpers/ZodBooleanHelpers.js";
import type IShowingSubmit from "./interface/IShowingSubmit.js";

export const ShowingSubmitSchema: ZodType<IShowingSubmit> = z.object({
    startTime: CoercedDateSchema,

    endTime: CoercedDateSchema.optional(),

    ticketPrice: RequiredNumber
        .gt(0, "Must be greater than 0"),

    language: RequiredStringSchema,

    subtitleLanguages: z
        .array(RequiredStringSchema)
        .nonempty({message: "Must not be empty."}),

    isSpecialEvent: RequiredBoolean
        .optional()
        .default(false),

    isActive: RequiredBoolean
        .optional()
        .default(true),

    movie: ObjectIdStringSchema,

    theatre: ObjectIdStringSchema,

    screen: ObjectIdStringSchema,
});