import {z} from "zod";
import SeatTypeConstant from "../../constant/SeatTypeConstant.js";

export const SeatTypeEnum = z.enum(SeatTypeConstant, {message: "Invalid Seat Type."});
export type SeatType = z.infer<typeof SeatTypeEnum>;