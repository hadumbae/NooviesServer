/**
 * @fileoverview Centralized registration for administrative "View Data" routes.
 * Handles the mounting of specialized admin-facing endpoints used for
 * dashboards, complex tables, and management interfaces.
 */

import type {Express} from "express";
import type {RouteRegistration} from "../../registerRoutes";
import {GenreViewDataRoutes} from "@domains/genre/_feat/admin-view-data";
import {PersonAdminViewDataRoutes} from "@domains/person/_feat/admin-view-data";

/**
 * Collection of route groups related to Genre administrative views.
 */
const genreRouteGroups: RouteRegistration[] = [
    {
        path: "/api/v1/views/desktop/admin/genres",
        router: GenreViewDataRoutes
    },
];

/**
 * Collection of route groups related to Person administrative views.
 */
const personRouteGroups: RouteRegistration[] = [
    {
        path: "/api/v1/views/desktop/admin/persons",
        router: PersonAdminViewDataRoutes,
    },
];

/**
 * Registers all administrative view data routes into the main Express application.
 */
export function registerAdminViewDataRoutes(app: Express) {
    const routeGroups: RouteRegistration[][] = [
        genreRouteGroups,
        personRouteGroups,
    ];

    for (const routeGroup of routeGroups) {
        for (const {path, router} of routeGroup) {
            app.use(path, router);
        }
    }
}