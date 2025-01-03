import type {Request, Response, NextFunction} from 'express';
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export default function isAuth(req: Request, res: Response, next: NextFunction) {
    const {authToken: token} = req.cookies;
    if (!token) throw createHttpError(401, "Unauthorized.");
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, "somesupersecretsecretsecret");
    } catch (e) {
        throw createHttpError(500, "Authorization failed!.");
    }

    if (!decodedToken) throw createHttpError(401, "Unauthorized.");
    const {user, isAdmin} = decodedToken as any;

    req.authUserID = user;
    req.authUserAdmin = isAdmin;

    next();
}