/**
 * @fileoverview Centralized registration for administrative view-data routes.
 */

import type { Express } from "express";
import type { RouteRegistration } from "../../registerRoutes";
import { GenreViewDataRoutes } from "@domains/genre/_feat/admin-view-data";
import { PersonAdminViewDataRoutes } from "@domains/person/_feat/admin-view-data";
import { TheatreAdminViewDataRoutes } from "@domains/theatre/_feat/admin-view-data";
import {TheatreScreenAdminViewDataRoutes} from "@domains/screen/_feat/view-data-admin";

/**
 * Mapping of administrative feature paths to their respective Express routers.
 */
const setupRouteGroups: RouteRegistration[] = [
    {
        path: "/api/v1/views/desktop/admin/genres",
        router: GenreViewDataRoutes
    },
    {
        path: "/api/v1/views/desktop/admin/persons",
        router: PersonAdminViewDataRoutes,
    },
    {
        path: "/api/v1/views/desktop/admin/theatres",
        router: TheatreAdminViewDataRoutes,
    },
    {
        path: "/api/v1/views/desktop/admin/theatre-screens",
        router: TheatreScreenAdminViewDataRoutes,
    },
];

/**
 * Mounts versioned administrative view-data route groups onto the main Express application.
 */
export function registerAdminViewDataRoutes(app: Express) {
    const routeGroups: RouteRegistration[][] = [
        setupRouteGroups,
    ];

    for (const routeGroup of routeGroups) {
        for (const { path, router } of routeGroup) {
            app.use(path, router);
        }
    }
}