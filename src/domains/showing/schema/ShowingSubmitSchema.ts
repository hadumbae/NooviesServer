import {z, type ZodType} from "zod";
import {IDString, RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {CoercedDate} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {RequiredBoolean} from "../../../shared/schema/helpers/ZodBooleanHelpers.js";
import type IShowingSubmit from "./interface/IShowingSubmit.js";

export const ShowingSubmitSchema: ZodType<IShowingSubmit> = z.object({
    startTime: CoercedDate,

    endTime: CoercedDate.optional(),

    ticketPrice: RequiredNumber
        .gt(0, "Must be greater than 0"),

    language: RequiredString,

    subtitleLanguages: z
        .array(RequiredString)
        .nonempty({message: "Must not be empty."}),

    isSpecialEvent: RequiredBoolean
        .optional()
        .default(false),

    isActive: RequiredBoolean
        .optional()
        .default(true),

    movie: IDString,

    theatre: IDString,

    screen: IDString,
});