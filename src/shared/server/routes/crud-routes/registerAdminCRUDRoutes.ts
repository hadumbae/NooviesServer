/**
 * @fileoverview Centralized registration for administrative CRUD (Create, Read, Update, Delete) routes.
 * This registry focuses on standard persistence operations for core domain entities,
 * distinguishing them from specialized "Feature" or "View Data" routes.
 */

import type {Express} from "express";
import type {RouteRegistration} from "../../registerRoutes.js";
import {GenreCRUDRoutes} from "@/domains/genres/_feat/crud";
import {PersonCRUDRoutes} from "@/domains/persons/_feat/crud";
import {ScreenCRUDRoutes} from "@/domains/screen/_feat/crud";
import {SeatCRUDRoutes} from "@/domains/seat/_feat/crud";
import {TheatreCRUDRoutes} from "@/domains/theatre/_feat/crud";
import {MovieCRUDRoutes} from "@/domains/movies/_feat/crud/MovieCRUDRoutes";
import {RoleTypeCRUDRoutes} from "@/domains/role-types/_feat/crud";
import {MovieCreditCRUDRoutes} from "@/domains/movieCredit/_feat/crud";
import {ShowingCRUDRoutes} from "@/domains/showing/_feat/crud";
import {SeatMapCRUDRoutes} from "@/domains/seatmap/_feat/crud";
import {ReservationCRUDRoutes} from "@/domains/reservations/_feat/crud";
import {MovieReviewCRUDRoutes} from "@/domains/movieReview/_feat/crud";

/**
 * Core metadata and foundational data configuration routes.
 */
const setupRoutes: RouteRegistration[] = [
    {path: "/api/v1/admin/persons/crud", router: PersonCRUDRoutes},
    {path: "/api/v1/admin/genres/crud", router: GenreCRUDRoutes},

    {path: "/api/v1/admin/theatre-screens/crud", router: ScreenCRUDRoutes},
    {path: "/api/v1/admin/seats/crud", router: SeatCRUDRoutes},
    {path: "/api/v1/admin/theatres/crud", router: TheatreCRUDRoutes},

    {path: "/api/v1/admin/movies/crud", router: MovieCRUDRoutes},
    {path: "/api/v1/admin/role-types/crud", router: RoleTypeCRUDRoutes},
    {path: "/api/v1/admin/movie-credits/crud", router: MovieCreditCRUDRoutes},

    {path: "/api/v1/admin/showings/crud", router: ShowingCRUDRoutes},
    {path: "/api/v1/admin/seat-maps/crud", router: SeatMapCRUDRoutes},
    {path: "/api/v1/admin/reservations/crud", router: ReservationCRUDRoutes},
    {path: "/api/v1/admin/movie-reviews/crud", router: MovieReviewCRUDRoutes},
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