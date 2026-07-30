/**
 * @fileoverview Registers data-related API routes for the Express application.
 */

import type {Express} from "express";
import type {RouteRegistration} from "@/shared/server/registerRoutes";
import {UIInputDataRoutes} from "@/domains/ui-inputs";

/** Registers domain-specific data routers to the Express application instance. */
export function registerDataRoutes(app: Express): void {
    const routes: RouteRegistration[] = [
        {path: "/api/v1/data/inputs", router: UIInputDataRoutes},
    ];

    for (const {path, router} of routes) {
        app.use(path, router);
    }
}