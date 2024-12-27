import type {Request, Response, NextFunction} from 'express';
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export default function isAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get("Authorization");
    if (!authHeader) throw createHttpError(401, "Unauthorized.");

    const token = authHeader.split(" ")[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, "somesupersecretsecretsecret");
    } catch (e) {
        throw createHttpError(500, "Authorization failed!.");
    }

    if (!decodedToken) throw createHttpError(401, "Unauthorized.");
    req.authUserID = decodedToken.user;
    req.authUserAdmin = decodedToken.isAdmin;

    next();
}