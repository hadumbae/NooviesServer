/**
 * @file Registration utility for specialized client "View Data" aggregation routes.
 * @filename registerClientViewDataRoutes.ts
 */

import type {Express} from "express";
import type {RouteRegistration} from "../registerRoutes.js";
import {MovieViewDataRoutes} from "../../../domains/movie/routing/client/MovieViewDataRoutes.js";

/**
 * Mounts routes designed to provide high-performance, aggregated data packages for client UIs.
 * @param app - The primary Express application instance.
 */
export function registerClientViewDataRoutes(app: Express) {
    const routes: RouteRegistration[] = [
        {path: "/api/v1/views/desktop/client/movies", router: MovieViewDataRoutes},
    ];

    for (const {path, router} of routes) {
        app.use(path, router);
    }
}