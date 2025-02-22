import 'dotenv/config';
import express, { type Express } from 'express';
import RegisterParsers from "./RegisterParsers.js";
import RegisterRoutes from "./RegisterRoutes.js";
import ErrorHandler from "../utility/ErrorHandler.js";
import RegisterCORS from "./RegisterCORS.js";
import RegisterGraphQL from "./RegisterGraphQL.js";

const app: Express = express();

RegisterCORS(app);
RegisterParsers(app);
RegisterGraphQL(app);
RegisterRoutes(app);

app.use(ErrorHandler);

export default app;