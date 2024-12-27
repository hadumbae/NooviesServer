import type {Request, Response, NextFunction} from 'express'
import {isHttpError} from "http-errors";

export default (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch((error) => {
            console.error(`Error [${fn.name}] ${error.message}]`);

            if (!isHttpError) res.status(500);
            next(new Error(error));
        });
}