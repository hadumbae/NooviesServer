import {RequiredString} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {RequiredNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";

export const TheatreSchemaBase = {
    name: RequiredString
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),

    location: RequiredString
        .min(1, "Required.")
        .max(255, "Must be 255 characters or less."),

    numberOfSeats: RequiredNumber
        .gte(1, "Must be equal or greater than 0."),
};