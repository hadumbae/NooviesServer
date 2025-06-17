import {z, type ZodType} from "zod";
import type ITheatreSubmit from "./interface/ITheatreSubmit.js";

import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";

export const TheatreSubmitSchema: ZodType<ITheatreSubmit> = z.object({
    name: RequiredStringSchema
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),

    location: RequiredStringSchema
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),
});