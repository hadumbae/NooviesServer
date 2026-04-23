/**
 * @fileoverview Orchestrates the mounting of standard administrative CRUD routes
 * across all functional domains. This centralized registry categorizes routes
 * into logical groups (Setup, Theatre, Movie, etc.) to maintain a scalable
 * API architecture.
 */

import type {Express} from "express";
import type {RouteRegistration} from "../../registerRoutes.js";
import RoleTypeRoutes from "@domains/roleType/routing/RoleTypeRoutes.js";
import MovieRoutes from "@domains/movie/routing/MovieRoutes.js";
import MovieCreditRoutes from "@domains/movieCredit/routing/MovieCreditRoutes.js";
import {MovieReviewCRUDRoutes} from "@domains/movieReview/routes/MovieReviewCRUDRoutes.js";
import ShowingRoutes from "@domains/showing/routing/ShowingRoutes.js";
import SeatMapRoutes from "@domains/seatmap/routing/SeatMapRoutes.js";
import {ReservationRoutes} from "@domains/reservation/routes/ReservationRoutes.js";
import {CustomerViewDataRoutes} from "@domains/customer/features/customer-details/routing";

/**
 * Core metadata and foundational data configuration routes.
 */
const setupRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/roletypes", router: RoleTypeRoutes},
];

/**
 * Content management routes for movies, cast/crew credits, and reviews.
 */
const movieRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/movies", router: MovieRoutes},
    {path: "/api/v1/admin/movie/credits", router: MovieCreditRoutes},
    {path: "/api/v1/admin/movie/reviews", router: MovieReviewCRUDRoutes},
];

/**
 * Scheduling and layout routes for cinema showtimes.
 */
const showingRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/showings", router: ShowingRoutes},
    {path: "/api/v1/admin/seatmaps", router: SeatMapRoutes},
];

/**
 * Transactional and feature-specific routes for admin-level reservation management.
 */
const reservationRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/reservations", router: ReservationRoutes},
];

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
        setupRoutes,
        movieRoutes,
        showingRoutes,
        reservationRoutes,
        customerRoutes,
    ];

    for (const routes of routeGroups) {
        for (const {path, router} of routes) {
            app.use(path, router);
        }
    }
}