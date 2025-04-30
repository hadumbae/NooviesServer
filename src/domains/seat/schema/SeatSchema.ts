import {z, type ZodType} from 'zod';
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {TheatreSchema} from "../../theatre/schema/TheatreSchema.js";
import type ISeat from "../model/ISeat.js";
import {RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {SeatTypeEnum} from "./enum/SeatTypeEnum.js";
import {RequiredBoolean} from "../../../shared/schema/helpers/ZodBooleanHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {ScreenSchema} from "../../screen/schema/ScreenSchema.js";

export const SeatSchema: ZodType<ISeat> = z.object({
    _id: IDInstance,

    row: RequiredStringSchema
        .min(1, "Required.")
        .max(50, "Must be 50 characters or less."),

    seatNumber: RequiredStringSchema
        .min(1, "Required.")
        .max(50, "Must be 50 characters or less."),

    seatType: SeatTypeEnum,

    isAvailable: RequiredBoolean,

    priceMultiplier: RequiredNumber
        .gte(0, "Must be 0 or greater."),

    theatre: z
        .union([IDInstance, z.lazy(() => TheatreSchema)]),

    screen: z
        .union([IDInstance, z.lazy(() => ScreenSchema)]),
});

export type ZSeat = z.infer<typeof SeatSchema>;