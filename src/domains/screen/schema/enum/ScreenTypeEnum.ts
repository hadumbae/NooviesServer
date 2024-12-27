import {z} from 'zod';
import ScreenTypeConstant from "../../constant/ScreenTypeConstant.js";

export const ScreenTypeEnum = z.enum(ScreenTypeConstant, {message: "Invalid Value."});
export type ScreenTypeEnumType = z.infer<typeof ScreenTypeEnum>;