/**
 * @file Main entry point for API route orchestration and registration.
 * @filename registerRoutes.ts
 */

import type {Express, Router} from "express";
import {registerAuthRoutes} from "./routes/registerAuthRoutes.js";
import {registerAdminRoutes} from "./routes/admin-routes/registerAdminRoutes.js";
import {registerClientRoutes} from "./routes/registerClientRoutes.js";
import {registerExternalRoutes} from "./routes/registerExternalRoutes.js";
import {registerAdminViewDataRoutes, registerClientViewDataRoutes} from "@shared/server/routes/view-data";

/**
 * Standard descriptor for mapping a URL segment to an Express router.
 */
export type RouteRegistration = {
    /** The base URL prefix for all endpoints within the attached router. */
    path: string;

    /** The Express router instance containing the route definitions. */
    router: Router;
};

/**
 * Bootstraps the entire routing table by delegating to specialized registration utilities.
 * @param app - The primary Express application instance.
 */
export default function registerRoutes(app: Express) {
    registerAuthRoutes(app);

    registerAdminRoutes(app);
    registerClientRoutes(app);

    registerAdminViewDataRoutes(app);
    registerClientViewDataRoutes(app);

    registerExternalRoutes(app);
}