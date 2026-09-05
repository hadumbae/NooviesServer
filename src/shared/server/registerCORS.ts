/**
 * @fileoverview Middleware registration for configuring CORS policy and allowed origins.
 */

import type { Express } from "express";
import cors, { type CorsOptions } from "cors";
import createHttpError from "http-errors";

/** Configures and registers cross-origin resource sharing middleware on the Express application. */
export function registerCORS(app: Express) {
    // Allowed origins for cross-origin requests
    let whitelist = ['http://localhost:3000'];

    const corsOptions: CorsOptions = {
        credentials: true,

        origin: function (origin, callback) {
            if (whitelist.includes(origin || "")) {
                callback(null, true);
            } else {
                callback(createHttpError(403, "Forbidden. Origin not allowed by CORS."));
            }
        },
    };

    app.use(cors(corsOptions));
}