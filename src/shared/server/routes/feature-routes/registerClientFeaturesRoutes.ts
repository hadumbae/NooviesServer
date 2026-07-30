/**
 * @fileoverview Registers feature-specific API routes for the client-facing application.
 */

import type {Express} from "express";
import type {RouteRegistration} from "../../registerRoutes";
import {FetchClientReservationRoutes} from "@/domains/reservations/_feat/fetch-client-reservations/routes";
import {TheatreSearchRoutes} from "@/domains/theatre/_feat/search-theatres";
import {ReviewsByMovieRoutes} from "@/domains/movies/_feat/fetch-reviews-by-movie";
import {ReserveTicketsRoutes} from "@/domains/reservations/_feat/reserve-tickets";
import {UpdateClientReservationRoutes} from "@/domains/reservations/_feat/update-client-reservations";

/**
 * Mounts domain-specific routers to the Express application instance.
 */
export function registerClientFeaturesRoutes(app: Express) {
    const routes: RouteRegistration[] = [
        {path: "/api/v1/feat/reviews-by-movie", router: ReviewsByMovieRoutes},
        {path: "/api/v1/feat/reserve-tickets", router: ReserveTicketsRoutes},
        {path: "/api/v1/feat/fetch-client-reservations", router: FetchClientReservationRoutes},
        {path: "/api/v1/feat/update-client-reservations", router: UpdateClientReservationRoutes},
        {path: "/api/v1/feat/search-theatres", router: TheatreSearchRoutes},
    ];

    for (const {path, router} of routes) {
        app.use(path, router);
    }
}