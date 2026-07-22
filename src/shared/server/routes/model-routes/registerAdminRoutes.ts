/**
 * @fileoverview Orchestrates the mounting of standard administrative CRUD routes
 * across all functional domains. This centralized registry categorizes routes
 * into logical groups (Setup, Theatre, Movie, etc.) to maintain a scalable
 * API architecture.
 */

import type {Express} from "express";
import type {RouteRegistration} from "../../registerRoutes.js";
import {CustomerViewDataRoutes} from "@/domains/customer/features/customer-details/routing";

/**
 * CRM-specific routes for administrative customer management.
 */
const customerRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/customers/view-data", router: CustomerViewDataRoutes},
];

/**
 * Mounts all categorized administrative routes onto the Express application.
 */
export function registerAdminRoutes(app: Express): void {
    const routeGroups: RouteRegistration[][] = [
        customerRoutes,
    ];

    for (const routes of routeGroups) {
        for (const {path, router} of routes) {
            app.use(path, router);
        }
    }
}