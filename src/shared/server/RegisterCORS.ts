import type {Express} from "express";
import cors, {type CorsOptions} from "cors";
import createHttpError from "http-errors";

export default function registerCORS(app: Express) {
    let whitelist = ['http://localhost:3000']

    let corsOptions: CorsOptions = {
        credentials: true,
        origin: function (origin, callback) {
            if (whitelist.includes(origin || "")) {
                callback(null, true)
            } else {
                callback(createHttpError(403, "Forbidden. Origin not allowed by CORS."))
            }
        },
    }

    app.use(cors(corsOptions));
}