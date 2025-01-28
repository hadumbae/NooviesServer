import type {Request, Response, NextFunction} from 'express'
import createHttpError from "http-errors";

export default function isAdmin(req: Request, res: Response, next: NextFunction) {
    const {authUserAdmin: isAdmin} = req;
    if (!isAdmin) throw createHttpError(401, "Unauthorized.");
    next();
}