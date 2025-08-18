import {z} from "zod";
import {DateStringSchema, UTCDateStringSchema} from "./DateString.schema.js";

/**
 * Type representing a valid date string in the `YYYY-MM-DD` format.
 */
export type DateString = z.infer<typeof DateStringSchema>;

/**
 * Type representing a UTC `Date` parsed from a valid `YYYY-MM-DD` string.
 */
export type UTCDateString = z.infer<typeof UTCDateStringSchema>;