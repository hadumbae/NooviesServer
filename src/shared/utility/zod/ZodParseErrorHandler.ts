import {ZodError} from "zod";
import ZodParseError from "../../errors/ZodParseError.js";

export default (error: Error, message: string = "Validation Failed.") => {
    if (error instanceof ZodError) {
        throw new ZodParseError({
            message: message,
            errors: (error as ZodError).errors,
        });
    }

    throw error;
}