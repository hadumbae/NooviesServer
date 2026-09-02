/**
 * @fileoverview Centralized registration for public-facing desktop client view data routes.
 */

import type {Express} from "express";
import type {RouteRegistration} from "@/shared/server/registerRoutes";
import {GenreClientViewDataRoutes} from "@/domains/genres/_feat/client-view-data";
import {TheatreClientViewDataRoutes} from "@/domains/theatre/_feat/client-view-data";
import {MovieClientViewDataRoutes} from "@/domains/movies/_feat/client-view-data";
import {PersonClientViewDataRoutes} from "@/domains/persons/_feat/client-view-data";
import {TheatreScreenClientViewDataRoutes} from "@/domains/screen";
import {HomepageRoutes} from "@/domains/homepage/_feat";

const pageRouteGroups: RouteRegistration[] = [
    {
        path: "/api/v1/views/desktop/client/home",
        router: HomepageRoutes,
    }
];

const setupRouteGroup: RouteRegistration[] = [
    {
        path: "/api/v1/views/desktop/client/genres",
        router: GenreClientViewDataRoutes,
    },
    {
        path: "/api/v1/views/desktop/client/theatres",
        router: TheatreClientViewDataRoutes,
    },
    {
        path: "/api/v1/views/desktop/client/theatre-screens",
        router: TheatreScreenClientViewDataRoutes,
    },
    {
        path: "/api/v1/views/desktop/movies/client",
        router: MovieClientViewDataRoutes,
    },
    {
        path: "/api/v1/views/desktop/persons/client",
        router: PersonClientViewDataRoutes,
    },
];

/** Registers all desktop client view data route groups into the Express application instance. */
export function registerClientViewDataRoutes(app: Express) {
    const routeGroups: RouteRegistration[][] = [
        pageRouteGroups,
        setupRouteGroup,
    ];

    for (const routeGroup of routeGroups) {
        for (const {path, router} of routeGroup) {
            app.use(path, router);
        }
    }
}