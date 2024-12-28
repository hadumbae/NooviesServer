import {z, type ZodType} from "zod";
import {IDString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import type {IScreenSubmit} from "../model/ScreenModel.interfaces.js";
import {ScreenSchemaBase} from "./base/ScreenSchemaBase.js";
import {SeatAsyncIDString, TheatreAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";

export const ScreenSubmitSchema: ZodType<IScreenSubmit> = z.object({
    ...ScreenSchemaBase,
    theatre: TheatreAsyncIDString,
    seats: z.array(SeatAsyncIDString),
})