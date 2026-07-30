/**
 * @fileoverview Registers external API routes for the Express application.
 */

import type {Express} from "express";
import type {RouteRegistration} from "../registerRoutes.js";
import {IpApiRoutes} from "../../../domains/external/ipapi/routing/IpApiRoutes.js";

/** Configures the Express application with routes for external service integrations. */
export function registerExternalRoutes(app: Express) {
    const routes: RouteRegistration[] = [
        {path: "/api/v1/ext/ip-geo", router: IpApiRoutes},
    ];

    for (const {path, router} of routes) {
        app.use(path, router);
    }
}