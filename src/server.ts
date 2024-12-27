import 'dotenv/config';
import express, { type Express } from 'express';
import registerRoutes from "./shared/routing/RegisterRoutes.js";
import bodyParser from "body-parser";

const app: Express = express();

app.use(bodyParser.json());


registerRoutes(app);

export default app;