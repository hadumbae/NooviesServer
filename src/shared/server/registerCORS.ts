import type { Express } from "express";
import cors, { type CorsOptions } from "cors";
import createHttpError from "http-errors";

/**
 * Registers CORS (Cross-Origin Resource Sharing) middleware for an Express app.
 *
 * This function configures the app to allow requests only from a whitelist of origins.
 * If a request comes from a non-whitelisted origin, a 403 Forbidden error is returned.
 *
 * @param app - The Express application instance to register CORS on.
 */
export default function registerCORS(app: Express) {
    // Allowed origins for cross-origin requests
    let whitelist = ['http://localhost:3000'];

    const corsOptions: CorsOptions = {
        /** Allows sending cookies and authentication headers. */
        credentials: true,

        /** Checks if the origin is allowed. */
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
