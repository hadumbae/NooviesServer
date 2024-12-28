import {z, type ZodType} from "zod";
import type {IShowing} from "../model/ShowingInterfaces.js";
import {IDString, RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {CoercedDate} from "../../../shared/schema/helpers/ZodDateHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {RequiredBoolean} from "../../../shared/schema/helpers/ZodBooleanHelpers.js";
import {MovieSchema} from "../../movie/schema/MovieSchema.js";
import {TheatreSchema} from "../../theatre/schema/TheatreSchema.js";
import {ScreenSchema} from "../../screen/schema/ScreenSchema.js";
import {SeatMapSchema} from "./set-map/SeatMapSchema.js";

export const ShowingSchema: ZodType<IShowing> = z.object({
    _id: z
        .union([IDString, IDInstance])
        .optional(),

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

    movie: z.union([
        IDString,
        IDInstance,
        z.lazy(() => MovieSchema),
    ]),

    theatre: z.union([
        IDString,
        IDInstance,
        z.lazy(() => TheatreSchema),
    ]),

    screen: z.union([
        IDString,
        IDInstance,
        z.lazy(() => ScreenSchema),
    ]),

    seatMap: z.array(SeatMapSchema),
});