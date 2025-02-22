import {z, type ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {TheatreSchema} from "../../theatre/schema/TheatreSchema.js";
import {SeatSchema} from "../../seat/schema/SeatSchema.js";
import type {IScreen} from "../interface/IScreen.js";
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {PositiveNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {ScreenTypeEnum} from "./enum/ScreenTypeEnum.js";

export const ScreenSchema: ZodType<IScreen> = z.object({
    _id: IDInstance,

    name: RequiredString
        .min(1, "Required.")
        .max(255, "Name must be 255 characters or less."),

    capacity: PositiveNumber
        .gt(0, "Capacity must be greater than 0"),

    screenType: ScreenTypeEnum,

    theatre: z
        .union([IDInstance, z.lazy(() => TheatreSchema)]),

    seats: z
        .array(z.union([IDInstance, z.lazy(() => SeatSchema)])),
});

export type ZScreen = z.infer<typeof ScreenSchema>;