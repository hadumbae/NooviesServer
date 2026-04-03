/**
 * @file Centralized registration for primary administrative CRUD API routes.
 * @filename registerAdminRoutes.ts
 */

import type {Express} from "express";
import type {RouteRegistration} from "../../registerRoutes.js";
import PersonRoutes from "@domains/person/routing/PersonRoutes.js";
import RoleTypeRoutes from "@domains/roleType/routing/RoleTypeRoutes.js";
import GenreRoutes from "@domains/genre/routing/GenreRoutes.js";
import SeatRoutes from "@domains/seat/routing/SeatRoutes.js";
import ScreenRoutes from "@domains/screen/routing/ScreenRoutes.js";
import TheatreRoutes from "@domains/theatre/routing/TheatreRoutes.js";
import MovieRoutes from "@domains/movie/routing/MovieRoutes.js";
import MovieCreditRoutes from "@domains/movieCredit/routing/MovieCreditRoutes.js";
import {MovieReviewCRUDRoutes} from "@domains/movieReview/routes/MovieReviewCRUDRoutes.js";
import ShowingRoutes from "@domains/showing/routing/ShowingRoutes.js";
import SeatMapRoutes from "@domains/seatmap/routing/SeatMapRoutes.js";
import {ReservationRoutes} from "@domains/reservation/routes/ReservationRoutes.js";
import {FetchRoutes as FetchAdminReservationRoutes} from "@domains/reservation/features/fetch-reservations/admin";
import {ReservationUpdateRoutes} from "@domains/reservation/features/update-reservations/routes";
import {GenreCRUDRoutes} from "@domains/genre/routing/GenreCRUDRoutes";

/**
 * Core metadata and foundational data configuration routes.
 * ---
 */
const setupRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/persons", router: PersonRoutes},
    {path: "/api/v1/admin/roletypes", router: RoleTypeRoutes},
    {path: "/api/v1/admin/genres", router: GenreRoutes},
    {path: "/api/v1/admin/genres/crud", router: GenreCRUDRoutes},
];

/**
 * Physical infrastructure routes including venues and seating arrangements.
 * ---
 */
const theatreRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/seats", router: SeatRoutes},
    {path: "/api/v1/admin/screens", router: ScreenRoutes},
    {path: "/api/v1/admin/theatres", router: TheatreRoutes},
];

/**
 * Content management routes for movies, cast/crew credits, and reviews.
 * ---
 */
const movieRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/movies", router: MovieRoutes},
    {path: "/api/v1/admin/movie/credits", router: MovieCreditRoutes},
    {path: "/api/v1/admin/movie/reviews", router: MovieReviewCRUDRoutes},
];

/**
 * Scheduling and layout routes for cinema showtimes.
 * ---
 */
const showingRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/showings", router: ShowingRoutes},
    {path: "/api/v1/admin/seatmaps", router: SeatMapRoutes},
];

/**
 * Transactional and feature-specific routes for admin-level reservation management.
 * ---
 */
const reservationRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/reservations", router: ReservationRoutes},
    {path: "/api/v1/admin/reservations/feat", router: ReservationUpdateRoutes},
    {path: "/api/v1/admin/reservations/feat", router: FetchAdminReservationRoutes},
];

/**
 * Orchestrates the mounting of standard administrative CRUD routes across all functional domains.
 * ---
 * @param app - The primary Express application instance.
 */
export function registerAdminRoutes(app: Express) {

    const routeGroups: RouteRegistration[][] = [
        setupRoutes,
        theatreRoutes,
        movieRoutes,
        showingRoutes,
        reservationRoutes,
    ];

    for (const routes of routeGroups) {
        for (const {path, router} of routes) {
            app.use(path, router);
        }
    }
}