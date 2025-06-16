import {z} from "zod";

export const PositiveNumberSchema = z
    .coerce
    .number({required_error: "Required.", invalid_type_error: "Must be a positive number."})
    .gt(0, "Must be a positive number.");