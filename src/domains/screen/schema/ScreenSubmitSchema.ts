import {z, type ZodType} from "zod";
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {TheatreAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";
import {PositiveNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {ScreenTypeEnum} from "./enum/ScreenTypeEnum.js";
import type {IScreenSubmit} from "../interface/IScreenSubmit.js";

export const ScreenSubmitSchema: ZodType<IScreenSubmit> = z.object({
    name: RequiredString
        .min(1, "Required.")
        .max(255, "Name must be 255 characters or less."),

    capacity: PositiveNumber
        .gt(0, "Capacity must be greater than 0"),

    screenType: ScreenTypeEnum,

    theatre: TheatreAsyncIDString,
});