import {z} from "zod";

export const RequiredBoolean = z.boolean({required_error: "Required", invalid_type_error: "Must be a boolean"});

export const ParamBoolean = z
    .union([
        z.literal("true").transform(() => true),
        z.literal("false").transform(() => false),
        z.boolean(),
    ], {message: "Invalid boolean string."}).optional();