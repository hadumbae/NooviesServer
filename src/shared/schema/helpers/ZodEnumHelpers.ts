import { z } from "zod";
import CountryConstant from "../../constants/CountryConstant.js";

export const CountryEnum = z.enum(CountryConstant, {message: "Invalid Country Value."});
export type CountryEnumType = z.infer<typeof CountryEnum>;