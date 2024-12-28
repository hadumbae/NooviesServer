import {z, type ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";
import {ScreenSchema} from "../../screen/schema/ScreenSchema.js";
import {SeatSchema} from "../../seat/schema/SeatSchema.js";
import type {ITheatre} from "../model/TheatreInterface.js";
import {TheatreSchemaBase} from "./TheatreSchemaBase.js";

export const TheatreSchema: ZodType<ITheatre> = z.object({
    ...TheatreSchemaBase,
    _id: IDInstance.readonly(),
    screens: z.array(z.union([IDInstance,z.lazy(() => ScreenSchema)])),
    seats: z.array(z.union([IDInstance,z.lazy(() => SeatSchema)])),
});