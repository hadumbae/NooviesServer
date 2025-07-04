import {z, type ZodType} from "zod";
import type IShowingSubmit from "./interface/IShowingSubmit.js";
import {CoercedNumberSchema} from "../../../shared/schema/numbers/CoercedNumberSchema.js";
import {CoercedDateSchema} from "../../../shared/schema/date/CoercedDateSchema.js";
import {ObjectIdStringSchema} from "../../../shared/schema/strings/ObjectIdStringSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {RequiredBoolean} from "../../../shared/schema/booleans/RequiredBoolean.js";

export const ShowingSubmitSchema: ZodType<IShowingSubmit> = z.object({
    startTime: CoercedDateSchema,

    endTime: CoercedDateSchema.optional(),

    ticketPrice: CoercedNumberSchema
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