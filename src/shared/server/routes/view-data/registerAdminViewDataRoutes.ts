/**
 * @fileoverview Registers Express route groups for administrative view data endpoints.
 */

import type { Express } from "express";
import type { RouteRegistration } from "../../registerRoutes";
import { GenreViewDataRoutes } from "@domains/genre/_feat/admin-view-data";
import { PersonAdminViewDataRoutes } from "@domains/person/_feat/admin-view-data";
import { TheatreAdminViewDataRoutes } from "@domains/theatre/_feat/admin-view-data";
import {TheatreScreenAdminViewDataRoutes} from "@domains/screen/_feat/view-data-admin";
import {ShowingAdminViewDataRoutes} from "@domains/showing/_feat/admin-view-data";

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

const showingRouteGroups: RouteRegistration[] = [
    {
        path: "/api/v1/views/desktop/admin/showings",
        router: ShowingAdminViewDataRoutes
    },
];

/** Registers all admin-facing view data route groups to the Express application. */
export function registerAdminViewDataRoutes(app: Express) {
    const routeGroups: RouteRegistration[][] = [
        setupRouteGroups,
        showingRouteGroups,
    ];

    for (const routeGroup of routeGroups) {
        for (const { path, router } of routeGroup) {
            app.use(path, router);
        }
    }
}