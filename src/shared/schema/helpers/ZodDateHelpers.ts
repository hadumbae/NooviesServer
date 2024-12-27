import {z} from "zod";

export const CoercedDate = z
    .coerce
    .date({
        required_error: "Required.",
        invalid_type_error: "Must be a valid date."
    });