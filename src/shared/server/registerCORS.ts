/**
 * @fileoverview Middleware registration for configuring CORS policy and allowed origins.
 */

import type {Express} from "express";
import cors, {type CorsOptions} from "cors";
import createHttpError from "http-errors";
import {getEnvVariables} from "@/shared/_feat";

/** Configures and registers cross-origin resource sharing middleware on the Express application. */
export function registerCORS(app: Express) {
    const {CORS_ALLOWED_ORIGINS} = getEnvVariables();

    const corsOptions: CorsOptions = {
        credentials: true,

        origin: function (origin, callback) {
            if (CORS_ALLOWED_ORIGINS.includes(origin || "")) {
                callback(null, true);
            } else {
                callback(createHttpError(403, "Forbidden. Origin not allowed by CORS."));
            }
        },
    };

    app.use(cors(corsOptions));
}