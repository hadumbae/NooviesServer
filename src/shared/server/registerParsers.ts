/**
 * @fileoverview Configures Express middleware for parsing request bodies and cookies.
 */

import type { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

/** Registers JSON body parsing and cookie parsing middleware on the Express application. */
export function registerParsers(app: Express) {
    app.use(bodyParser.json());
    app.use(cookieParser());
}