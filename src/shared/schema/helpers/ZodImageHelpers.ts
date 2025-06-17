import {z} from "zod";

import {RequiredStringSchema} from "../strings/RequiredStringSchema.js";

export const CloudinaryImageObject = z.object({
    public_id: RequiredStringSchema,
    secure_url: RequiredStringSchema.url("Must be a valid URL."),
});