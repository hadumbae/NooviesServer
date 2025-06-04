import {z} from "zod";

export const RequiredBoolean = z.boolean({required_error: "Required", invalid_type_error: "Must be a boolean"});

