import {z} from "zod";
import {RequiredString} from "./ZodStringHelpers.js";

export const CloudinaryImageObject = z.object({
    public_id: RequiredString,
    secure_url: RequiredString.url("Must be a valid URL."),
});