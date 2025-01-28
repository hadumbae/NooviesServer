import type {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {isHttpError} from "http-errors";
import ZodParseError from "../errors/ZodParseError.js";
import {ZodError} from "zod";

/**
 * Handles synchronous errors.
 */
const errorHandler: ErrorRequestHandler = (error: Error, req: Request, res: Response, next: NextFunction ) => {
    console.error("ERROR HANDLER | ", error);

    let errorMessage = "Oops. Something went wrong!";
    let errorStatus = 500;

    if (isHttpError(error)) {
        errorMessage = error.message;
        errorStatus = error.status;
    }

    if (error instanceof ZodError) {
        console.error("Has a ZodError!");
        res.status(400).json({message: "Validation failed.", errors: error.errors});
    }

    if (error instanceof ZodParseError) {
        console.error("Had a ZodParseError!");
        const {message, errors} = error;
        res.status(400).json({message, errors});
    }

    console.error("Had a ZodParseError!");
    res.status(errorStatus).json({ message: errorMessage });
}

export default errorHandler;