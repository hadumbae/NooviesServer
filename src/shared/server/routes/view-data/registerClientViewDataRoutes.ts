/**
 * @fileoverview Centralized registration for public-facing "View Data" routes.
 * Aggregates domain-specific route groups (Genres, Movies) and mounts them
 * under specialized "desktop-client" API prefixes.
 */

import type {Express} from "express";
import type {RouteRegistration} from "@shared/server/registerRoutes";
import {GenreClientViewDataRoutes} from "@domains/genre/_feat/client-view-data";
import {MovieClientViewDataRoutes} from "@domains/movie/routing/client/MovieClientViewDataRoutes";

/**
 * Collection of route groups related to Genre client-side views.
 */
const genreRouteGroups: RouteRegistration[] = [
    {
        path: "/api/v1/views/desktop/client/genres",
        router: GenreClientViewDataRoutes
    },
];

/**
 * Collection of route groups related to Movie client-side views.
 */
const movieRouteGroups: RouteRegistration[] = [
    {
        path: "/api/v1/views/desktop/movies/client",
        router: MovieClientViewDataRoutes
    },
];

/**
 * Registers all client-facing view data routes into the main Express application.
 */
export function registerClientViewDataRoutes(app: Express) {
    const routeGroups: RouteRegistration[][] = [
        genreRouteGroups,
        movieRouteGroups,
    ];

    for (const routeGroup of routeGroups) {
        for (const {path, router} of routeGroup) {
            app.use(path, router);
        }
    }
}