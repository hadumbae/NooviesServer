import {z, type ZodType} from 'zod';
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {TheatreSchema} from "../../theatre/schema/TheatreSchema.js";
import {SeatSchemaBase} from "./SeatSchemaBase.js";
import type ISeat from "../model/ISeat.js";

export const SeatSchema: ZodType<ISeat> = z.object({
    ...SeatSchemaBase,
    _id: IDInstance,
    theatre: z.union([IDInstance, z.lazy(() => TheatreSchema)]),
});

export type Seat = z.infer<typeof SeatSchema>;