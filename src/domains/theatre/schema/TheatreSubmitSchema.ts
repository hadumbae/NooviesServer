import {z, type ZodType} from "zod";
import type ITheatreSubmit from "./interface/ITheatreSubmit.js";
import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";

export const TheatreSubmitSchema: ZodType<ITheatreSubmit> = z.object({
    name: RequiredString
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),

    location: RequiredString
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),
});