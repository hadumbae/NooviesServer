import {z, type ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {ScreenSchema} from "../../screen/schema/ScreenSchema.js";
import {SeatSchema} from "../../seat/schema/SeatSchema.js";
import type {ITheatre, ITheatreSubmit} from "../model/TheatreInterface.js";
import {TheatreSchemaBase} from "./TheatreSchemaBase.js";
import {ScreenAsyncIDString, SeatAsyncIDString} from "../../../shared/schema/helpers/ZodIDHelpers.js";

export const TheatreSubmitSchema: ZodType<ITheatreSubmit> = z.object({
    ...TheatreSchemaBase,
    screens: z.array(ScreenAsyncIDString),
    seats: z.array(SeatAsyncIDString),
});