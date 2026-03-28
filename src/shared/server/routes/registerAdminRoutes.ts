/**
 * @file Centralized registration for primary administrative CRUD API routes.
 * @filename registerAdminRoutes.ts
 */

import type {Express} from "express";
import PersonRoutes from "../../../domains/person/routing/PersonRoutes.js";
import RoleTypeRoutes from "../../../domains/roleType/routing/RoleTypeRoutes.js";
import GenreRoutes from "../../../domains/genre/routing/GenreRoutes.js";
import SeatRoutes from "../../../domains/seat/routing/SeatRoutes.js";
import ScreenRoutes from "../../../domains/screen/routing/ScreenRoutes.js";
import TheatreRoutes from "../../../domains/theatre/routing/TheatreRoutes.js";
import MovieRoutes from "../../../domains/movie/routing/MovieRoutes.js";
import MovieCreditRoutes from "../../../domains/movieCredit/routing/MovieCreditRoutes.js";
import {MovieReviewCRUDRoutes} from "../../../domains/movieReview/routes/MovieReviewCRUDRoutes.js";
import ShowingRoutes from "../../../domains/showing/routing/ShowingRoutes.js";
import SeatMapRoutes from "../../../domains/seatmap/routing/SeatMapRoutes.js";
import {ReservationRoutes} from "../../../domains/reservation/routes/ReservationRoutes.js";
import type {RouteRegistration} from "../registerRoutes.js";
import {FetchRoutes as FetchAdminReservationRoutes} from "@domains/reservation/features/fetch-reservations/admin";
import {ReservationUpdateRoutes} from "@domains/reservation/features/update-reservations/routes";

/**
 * Orchestrates the mounting of standard administrative CRUD routes across all functional domains.
 * @param app - The primary Express application instance.
 */
export function registerAdminRoutes(app: Express) {
    const routes: RouteRegistration[] = [
        {path: "/api/v1/admin/persons", router: PersonRoutes},
        {path: "/api/v1/admin/roletypes", router: RoleTypeRoutes},
        {path: "/api/v1/admin/genres", router: GenreRoutes},

        {path: "/api/v1/admin/seats", router: SeatRoutes},
        {path: "/api/v1/admin/screens", router: ScreenRoutes},
        {path: "/api/v1/admin/theatres", router: TheatreRoutes},

        {path: "/api/v1/admin/movies", router: MovieRoutes},
        {path: "/api/v1/admin/movie/credits", router: MovieCreditRoutes},
        {path: "/api/v1/admin/movie/reviews", router: MovieReviewCRUDRoutes},

        {path: "/api/v1/admin/showings", router: ShowingRoutes},
        {path: "/api/v1/admin/seatmaps", router: SeatMapRoutes},

        {path: "/api/v1/admin/reservations", router: ReservationRoutes},
        {path: "/api/v1/admin/reservations/feat", router: ReservationUpdateRoutes},
        {path: "/api/v1/admin/reservations/feat", router: FetchAdminReservationRoutes},
    ];

    for (const {path, router} of routes) {
        app.use(path, router);
    }
}