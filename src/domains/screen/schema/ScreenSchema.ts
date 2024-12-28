import {z, type ZodType} from "zod";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {TheatreSchema} from "../../theatre/schema/TheatreSchema.js";
import {SeatSchema} from "../../seat/schema/SeatSchema.js";
import type {IScreen} from "../model/ScreenModel.interfaces.js";
import {ScreenSchemaBase} from "./base/ScreenSchemaBase.js";

export const ScreenSchema: ZodType<IScreen> = z.object({
    ...ScreenSchemaBase,
    _id: IDInstance,
    theatre: z.union([IDInstance, z.lazy(() => TheatreSchema)]),
    seats: z.array(z.union([IDInstance, z.lazy(() => SeatSchema)])),
})