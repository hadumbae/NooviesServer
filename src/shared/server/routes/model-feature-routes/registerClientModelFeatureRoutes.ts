/**
 * @fileoverview Registers Express route groups for client-facing model features.
 */

import type {Express} from "express";
import type {RouteRegistration} from "@/shared/server/registerRoutes";
import {MyMovieReviewsRoutes} from "@/domains/movie-reviews";
import {UserFavouritesRoutes} from "@/domains/users";

const userRoutes: RouteRegistration[] = [
    {path: "/api/v1/client/users/feat/my-reviews", router: MyMovieReviewsRoutes},
    {path: "/api/v1/client/users/feat/my-favourites", router: UserFavouritesRoutes},
];

/** Registers feature-specific route groups to the Express application instance. */
export function registerClientModelFeatureRoutes(app: Express): void {
    const routeGroups: RouteRegistration[][] = [
        userRoutes,
    ];

    for (const routes of routeGroups) {
        for (const {path, router} of routes) {
            app.use(path, router);
        }
    }
}