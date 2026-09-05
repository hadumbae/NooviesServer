/**
 * @fileoverview Express application configuration and middleware registration.
 */

import 'dotenv/config';
import express, { type Express } from 'express';
import handleGlobalErrors from "../utility/handlers/handleGlobalErrors.js";
import {registerParsers} from "./registerParsers.js";
import {registerRoutes} from "./registerRoutes.js";
import {registerCORS} from "./registerCORS.js";
import {registerGraphQL} from "./registerGraphQL.js";

const app: Express = express();

registerCORS(app);
registerParsers(app);
registerGraphQL(app);
registerRoutes(app);

app.use(handleGlobalErrors);

/** Main Express application server instance. */
export {
    app as server,
}