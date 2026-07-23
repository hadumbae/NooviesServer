

/**
 * @fileoverview Registers authentication and user management routes to the Express application.
 */

import type {Express} from "express";
import type {RouteRegistration} from "../registerRoutes.js";
import UserRoutes from "../../../domains/users/routing/UserRoutes.js";
import {ManageUsersRoutes} from "@/domains/authentication/_feat/manage-users";

/** Mounts authentication and user-related routers onto the provided Express instance. */
export function registerAuthRoutes(app: Express) {
    const routes: RouteRegistration[] = [
        {path: "/auth", router: ManageUsersRoutes},
        {path: "/api/v1/users", router: UserRoutes},
    ];

    /** Iterative mounting of routers onto the app instance */
    for (const {path, router} of routes) {
        app.use(path, router);
    }
}