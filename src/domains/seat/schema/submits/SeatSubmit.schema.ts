import {z, type ZodType} from "zod";

import type ISeatSubmit from "../interface/ISeatSubmit.js";

import {ScreenAsyncIDString, TheatreAsyncIDString} from "../../../../shared/schema/helpers/ZodIDHelpers.js";
import {SeatTypeEnum} from "../enum/SeatTypeEnum.js";

import {CoercedNumberSchema} from "../../../../shared/schema/numbers/CoercedNumberSchema.js";
import {RequiredStringSchema} from "../../../../shared/schema/strings/RequiredStringSchema.js";
import {RequiredBoolean} from "../../../../shared/schema/booleans/RequiredBoolean.js";
import {PositiveNumberSchema} from "../../../../shared/schema/numbers/PositiveNumberSchema.js";
import {NonNegativeNumberSchema} from "../../../../shared/schema/numbers/NonNegativeNumberSchema.js";
import type ISeatsByRowSubmit from "../interface/ISeatsByRowSubmit.js";

export const SeatSubmitBaseSchema = z.object({
    seatType: SeatTypeEnum,
    isAvailable: RequiredBoolean,
    priceMultiplier: CoercedNumberSchema.gte(0, "Must be 0 or greater."),
    theatre: TheatreAsyncIDString,
    screen: ScreenAsyncIDString,
});

export const SeatSubmitRawSchema = SeatSubmitBaseSchema.extend({
    row: RequiredStringSchema.min(1, "Required.").max(10, "Must be 10 characters or less."),
    seatNumber: NonNegativeNumberSchema,
    seatLabel: RequiredStringSchema.max(50, "Must be 50 characters or less.").optional(),
    x: PositiveNumberSchema.optional(),
    y: PositiveNumberSchema.optional(),
});

export const SeatsByRowSubmitRawSchema = SeatSubmitBaseSchema.extend({
    row: RequiredStringSchema.max(10, "Must be 10 characters or less."),
    numberOfSeats: PositiveNumberSchema,
});

export const SeatSubmitSchema = SeatSubmitRawSchema as ZodType<ISeatSubmit>;
export const SeatsByRowSubmitSchema = SeatsByRowSubmitRawSchema as ZodType<ISeatsByRowSubmit>;

