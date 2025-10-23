import type { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

/**
 * Registers body and cookie parsing middleware for an Express application.
 *
 * This function adds:
 * - JSON body parsing (`body-parser.json()`)
 * - Cookie parsing (`cookie-parser()`)
 *
 * @param app - The Express application instance to register the middleware on.
 */
export default function registerParsers(app: Express) {
    app.use(bodyParser.json());
    app.use(cookieParser());
};
