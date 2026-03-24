/**
 * @file Registration utility for administrative and authentication-related API routes.
 * @filename registerAuthRoutes.ts
 */

import type {Express} from "express";
import AuthRoutes from "../../../domains/authentication/routing/AuthRoutes.js";
import UserRoutes from "../../../domains/users/routing/UserRoutes.js";
import type {RouteRegistration} from "../registerRoutes.js";

/**
 * Mounts administrative and authentication route modules onto the Express application.
 * @param app - The primary Express application instance.
 */
export function registerAuthRoutes(app: Express) {
    const routes: RouteRegistration[] = [
        {path: "/auth", router: AuthRoutes},
        {path: "/api/v1/users", router: UserRoutes},
    ];

    /** Iterative mounting of routers onto the app instance */
    for (const {path, router} of routes) {
        app.use(path, router);
    }
}