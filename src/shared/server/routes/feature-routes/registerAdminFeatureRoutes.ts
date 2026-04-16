/**
 * @fileoverview Centralized registration for administrative "Feature" routes.
 * Unlike standard CRUD operations, these routes handle specialized business logic,
 * complex updates, and non-standard actions (e.g., image processing or review moderation).
 */

import type {Express} from "express";
import type {RouteRegistration} from "@shared/server/registerRoutes";
import {PersonImageRoutes} from "@domains/person/_feat/update-image";
import {ReservationUpdateRoutes} from "@domains/reservation/features/update-reservations/routes";
import {FetchAdminReservationRoutes} from "@domains/reservation/features/fetch-reservations/admin";
import {CustomerMovieReviewActions} from "@domains/movieReview/features/customer-review-actions/routing";

/**
 * Foundation feature routes.
 */
const setupRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/persons/feat", router: PersonImageRoutes},
];

/**
 * Transactional feature routes for reservations.
 */
const reservationRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/reservations/feat", router: ReservationUpdateRoutes},
    {path: "/api/v1/admin/reservations/feat", router: FetchAdminReservationRoutes},
];

/**
 * Customer relationship and moderation features.
 */
const customerRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/customers/feat/review-actions", router: CustomerMovieReviewActions},
];

/**
 * Registers all administrative feature-specific routes into the Express application.
 */
export function registerAdminFeatureRoutes(app: Express): void {
    const routeGroups: RouteRegistration[][] = [
        setupRoutes,
        reservationRoutes,
        customerRoutes,
    ];

    for (const routes of routeGroups) {
        for (const {path, router} of routes) {
            app.use(path, router);
        }
    }
}