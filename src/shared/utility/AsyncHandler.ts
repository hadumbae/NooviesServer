import type {Request, Response, NextFunction} from 'express'
import {isHttpError} from "http-errors";

export default (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch((error) => {
            if (!isHttpError) res.status(500);
            next(error);
        });
}