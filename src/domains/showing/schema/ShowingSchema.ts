import {z, type ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {MovieSchema} from "../../movie/schema/MovieSchema.js";
import {TheatreSchema} from "../../theatre/schema/TheatreSchema.js";
import {ScreenSchema} from "../../screen/schema/screen/Screen.schema.js";
import {SeatMapSchema} from "../../seatmap/schema/SeatMapSchema.js";
import type IShowing from "../model/IShowing.js";
import {CoercedNumberSchema} from "../../../shared/schema/numbers/CoercedNumberSchema.js";
import {CoercedDateSchema} from "../../../shared/schema/date/CoercedDateSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {RequiredBoolean} from "../../../shared/schema/booleans/RequiredBoolean.js";

export const ShowingSchema: ZodType<IShowing> = z.object({
    _id: IDInstance,

    startTime: CoercedDateSchema,

    endTime: CoercedDateSchema,

    ticketPrice: CoercedNumberSchema
        .gt(0, "Must be greater than 0"),

    language: RequiredStringSchema,

    subtitleLanguages: z
        .array(RequiredStringSchema)
        .nonempty({message: "Must not be empty."}),

    isSpecialEvent: RequiredBoolean,

    isActive: RequiredBoolean,

    movie: z.union([
        IDInstance,
        z.lazy(() => MovieSchema),
    ]),

    theatre: z
        .union([IDInstance, z.lazy(() => TheatreSchema)]),

    screen: z
        .union([IDInstance, z.lazy(() => ScreenSchema)]),

    seating: z
        .array(SeatMapSchema),
});

export type ZShowing = z.infer<typeof ShowingSchema>;