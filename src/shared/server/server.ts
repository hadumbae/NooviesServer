import 'dotenv/config';
import express, { type Express } from 'express';
import RegisterParsers from "./RegisterParsers.js";
import RegisterRoutes from "./RegisterRoutes.js";
import ErrorHandler from "../utility/ErrorHandler.js";
import RegisterCORS from "./RegisterCORS.js";

const app: Express = express();

RegisterCORS(app);
RegisterParsers(app);
RegisterRoutes(app);

app.use(ErrorHandler);

export default app;