/**
 * @fileoverview Registers administrative feature routes for the Express application.
 */

import type {Express} from "express";
import type {RouteRegistration} from "@/shared/server/registerRoutes";
import {PersonImageRoutes} from "@/domains/person/_feat/update-image";
import {FetchAdminReservationRoutes} from "@/domains/reservation/_feat/fetch-customer-reservations";
import {PersonCreditRoutes} from "@/domains/movieCredit/_feat/person-credits";
import {UIInputDataRoutes} from "@/domains/ui-inputs";
import {GenreImageManagementRoutes} from "@/domains/genre/_feat/manage-image";
import {MovieImageManagementRoutes} from "@/domains/movie/_feat/manage-image/routes";
import {ReservationUpdateRoutes} from "@/domains/reservation/_feat/update-reservations";
import {CustomerMovieReviewActions} from "@/domains/movieReview/_feat/customer-review-actions";

/**
 * Foundation feature routes.
 */
const setupRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/inputs/feat", router: UIInputDataRoutes},
    {path: "/api/v1/admin/persons/feat", router: PersonImageRoutes},
    {path: "/api/v1/admin/genres/feat/manage-images", router: GenreImageManagementRoutes},
    {path: "/api/v1/admin/movies/feat/manage-images", router: MovieImageManagementRoutes},
];

/**
 * Transactional feature routes for reservations.
 */
const reservationRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/reservations/feat", router: ReservationUpdateRoutes},
    {path: "/api/v1/admin/reservations/feat", router: FetchAdminReservationRoutes},
];

/**
 * Aggregation and analytics feature routes for credits.
 */
const creditRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/movie-credits/feat", router: PersonCreditRoutes},
];

/**
 * Customer relationship and moderation features.
 */
const customerRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/customers/feat/review-actions", router: CustomerMovieReviewActions},
];

/**
 * Mounts all administrative feature-specific routers into the provided Express application instance.
 */
export function registerAdminFeatureRoutes(app: Express): void {
    const routeGroups: RouteRegistration[][] = [
        setupRoutes,
        reservationRoutes,
        customerRoutes,
        creditRoutes,
    ];

    for (const routes of routeGroups) {
        for (const {path, router} of routes) {
            app.use(path, router);
        }
    }
}