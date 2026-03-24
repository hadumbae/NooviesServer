/**
 * @file Registration utility for routes that interface with external third-party APIs and services.
 * @filename registerExternalRoutes.ts
 */

import type {Express} from "express";
import type {RouteRegistration} from "../registerRoutes.js";
import {IpApiRoutes} from "../../../domains/external/ipapi/routing/IpApiRoutes.js";

/**
 * Mounts routes that act as proxies or integrators for external service providers.
 * @param app - The primary Express application instance.
 */
export function registerExternalRoutes(app: Express) {
    const routes: RouteRegistration[] = [
        {path: "/api/v1/ext/ip-geo", router: IpApiRoutes},
    ];

    for (const {path, router} of routes) {
        app.use(path, router);
    }
}