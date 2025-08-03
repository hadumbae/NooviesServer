import type {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {isHttpError} from "http-errors";
import ZodParseError from "../errors/ZodParseError.js";
import {ZodError} from "zod";

/**
 * Handles synchronous errors.
 */
const errorHandler: ErrorRequestHandler = (error: Error, req: Request, res: Response, next: NextFunction ) => {
    console.error("ERROR HANDLER | ", error);

    if (error instanceof ZodError) {
        console.error("Has a ZodError!");
        const {message, errors} = {message: "Validation failed.", errors: error.errors}
        res.status(422).json({message, errors});
    }

    if (error instanceof ZodParseError) {
        console.error("Had a ZodParseError!");
        const {message, errors} = error;
        res.status(422).json({message, errors});
    }

    let errorMessage = "Oops. Something went wrong!";
    let errorStatus = 500;

    if (isHttpError(error)) {
        errorMessage = error.message;
        errorStatus = error.status;
    }

    res.status(errorStatus).json({ message: errorMessage });
}

export default errorHandler;