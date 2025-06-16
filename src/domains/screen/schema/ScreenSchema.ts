import {z, type ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {TheatreSchema} from "../../theatre/schema/TheatreSchema.js";
import {SeatSchema} from "../../seat/schema/SeatSchema.js";
import type {IScreen} from "../interface/IScreen.js";
import {RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {ScreenTypeEnum} from "./enum/ScreenTypeEnum.js";
import {ShowingSchema} from "../../showing/schema/ShowingSchema.js";
import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";

export const ScreenSchema: ZodType<IScreen> = z.object({
    _id: IDInstance,

    name: RequiredStringSchema
        .min(1, "Required.")
        .max(255, "Name must be 255 characters or less."),

    capacity: PositiveNumberSchema
        .gt(0, "Capacity must be greater than 0"),

    screenType: ScreenTypeEnum,

    theatre: z
        .union([IDInstance, z.lazy(() => TheatreSchema)]),

    seats: z
        .array(z.union([IDInstance, z.lazy(() => SeatSchema)])),

    showings: z
        .array(z.union([IDInstance, z.lazy(() => ShowingSchema)])),
});

export type ZScreen = z.infer<typeof ScreenSchema>;