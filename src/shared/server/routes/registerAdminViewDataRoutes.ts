/**
 * @file Registration utility for administrative "View Data" routes.
 * @filename registerAdminViewDataRoutes.ts
 */

import type {Express} from "express";
import type {RouteRegistration} from "../registerRoutes.js";
import {GenreViewDataRoutes} from "../../../domains/genre/routing/GenreViewDataRoutes.js";

/**
 * Mounts specialized administrative routes used for aggregating complex view data.
 * @param app - The primary Express application instance.
 */
export function registerAdminViewDataRoutes(app: Express) {
    const routes: RouteRegistration[] = [
        {path: "/api/v1/admin/genres", router: GenreViewDataRoutes},
    ];

    /** Mounting specialized view routers onto the app instance */
    for (const {path, router} of routes) {
        app.use(path, router);
    }
}