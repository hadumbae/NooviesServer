import {ZodError} from "zod";
import ZodParseError from "../../errors/ZodParseError.js";

export default (error: Error) => {
    if (error instanceof ZodError) {
        throw new ZodParseError({
            message: "Validation Failed.",
            errors: (error as ZodError).errors,
        });
    }

    throw error;
}