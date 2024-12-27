import {z} from "zod";

export const RequiredNumber = z
    .coerce
    .number({required_error: "Required.", invalid_type_error: "Must be a valid number."});

export const PositiveNumber = z
    .coerce
    .number({required_error: "Required.", invalid_type_error: "Must be a positive number."})
    .gt(0, "Must be a positive number.");