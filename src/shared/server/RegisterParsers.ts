import type {Express} from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const registerParsers = (app: Express) => {
    app.use(bodyParser.json());
    app.use(cookieParser());
};

export default registerParsers;