import {z} from "zod";
import {IDInstance} from "../../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {RequiredString} from "../../../../shared/schema/helpers/ZodStringHelpers.js";
import {TheatreSchema} from "../../../theatre/schema/TheatreSchema.js";
import {PositiveNumber} from "../../../../shared/schema/helpers/ZodNumberHelpers.js";
import {SeatSchema} from "../../../seat/schema/SeatSchema.js";
import {ScreenTypeEnum} from "../enum/ScreenTypeEnum.js";

export const ScreenSchemaBase = {
    name: RequiredString
        .min(1, "Required.")
        .max(255, "Name must be 255 characters or less."),

    theatre: z
        .union([
            IDInstance,
            z.lazy(() => TheatreSchema),
        ]),

    capacity: PositiveNumber
        .gt(0, "Capacity must be greater than 0"),

    seats: z.array(z.union([
        IDInstance,
        z.lazy(() => SeatSchema),
    ])),

    screenType: ScreenTypeEnum,
};