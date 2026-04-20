/**
 * @fileoverview Centralized registration for administrative CRUD (Create, Read, Update, Delete) routes.
 * This registry focuses on standard persistence operations for core domain entities,
 * distinguishing them from specialized "Feature" or "View Data" routes.
 */

import type {Express} from "express";
import type {RouteRegistration} from "../../registerRoutes.js";
import {GenreCRUDRoutes} from "@domains/genre/_feat/crud";
import {PersonCRUDRoutes} from "@domains/person/_feat/crud";
import {ScreenCRUDRoutes} from "@domains/screen/_feat/crud";
import {SeatCRUDRoutes} from "@domains/seat/_feat/crud";

/**
 * Core metadata and foundational data configuration routes.
 */
const setupRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/persons/crud", router: PersonCRUDRoutes},
    {path: "/api/v1/admin/genres/crud", router: GenreCRUDRoutes},
    {path: "/api/v1/admin/screens/crud", router: ScreenCRUDRoutes},
    {path: "/api/v1/admin/seats/crud", router: SeatCRUDRoutes},
];

/**
 * Registers all administrative CRUD routes into the main Express application.
 */
export function registerAdminCRUDRoutes(app: Express): void {
    const routeGroups: RouteRegistration[][] = [
        setupRoutes,
    ];

    for (const routes of routeGroups) {
        for (const {path, router} of routes) {
            app.use(path, router);
        }
    }
}