import type {Response} from "express";
import {ZodError} from "zod";

export default (params: {res: Response, error: any}) => {
    const {res, error} = params;

    if (error instanceof ZodError) {
        return res.status(400)
            .json({
                message: "Validation Failed",
                errors: error.errors
            });
    }

    return res.status(500).json({
        message: "Internal Server Error."
    });
}