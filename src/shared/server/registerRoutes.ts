/**
 * @fileoverview Centralized registration of all application routes for the Express server.
 */

import type {Express, Router} from "express";
import {
    registerAdminCRUDRoutes,
    registerAdminModelFeatureRoutes, registerAdminViewDataRoutes,
    registerAuthRoutes, registerClientFeaturesRoutes,
    registerClientModelFeatureRoutes, registerClientViewDataRoutes, registerDataRoutes, registerExternalRoutes
} from "@/shared/server/routes";


/** Represents a route path and its associated Express router. */
export type RouteRegistration = {
    path: string;
    router: Router;
};

/** Orchestrates the registration of all application route modules onto the Express instance. */
export function registerRoutes(app: Express) {
    registerAuthRoutes(app);
    registerDataRoutes(app);
    registerExternalRoutes(app);

    registerClientFeaturesRoutes(app);

    registerAdminCRUDRoutes(app);

    registerAdminModelFeatureRoutes(app);
    registerClientModelFeatureRoutes(app);

    registerAdminViewDataRoutes(app);
    registerClientViewDataRoutes(app);

}