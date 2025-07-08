import {z} from "zod";
import {SeatsByRowSubmitSchema, SeatSubmitSchema} from "./SeatSubmit.schema.js";

export type SeatSubmitData = z.infer<typeof SeatSubmitSchema>;
export type SeatsByRowSubmitData = z.infer<typeof SeatsByRowSubmitSchema>;