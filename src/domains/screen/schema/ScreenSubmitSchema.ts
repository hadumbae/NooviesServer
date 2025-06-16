import {z, type ZodType} from "zod";
import {RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {TheatreAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import {ScreenTypeEnum} from "./enum/ScreenTypeEnum.js";
import type {IScreenSubmit} from "../interface/IScreenSubmit.js";
import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";

export const ScreenSubmitSchema: ZodType<IScreenSubmit> = z.object({
    name: RequiredStringSchema
        .min(1, "Required.")
        .max(255, "Name must be 255 characters or less."),

    capacity: PositiveNumberSchema
        .gt(0, "Capacity must be greater than 0"),

    screenType: ScreenTypeEnum,

    theatre: TheatreAsyncIDString,
});