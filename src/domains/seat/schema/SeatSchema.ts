import {z, type ZodType} from 'zod';
import type {ISeat} from "../model/SeatModel.js";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";
import {SeatSubmitSchema} from "./SeatSubmitSchema.js";

export const SeatSchema: ZodType<ISeat> = SeatSubmitSchema.extend({
    _id: IDInstance,
});

export type Seat = z.infer<typeof SeatSchema>;