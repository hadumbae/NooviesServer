/**
 * @file Registration utility for client-facing public and protected API routes.
 * @filename registerClientRoutes.ts
 */

import type {Express} from "express";
import type {RouteRegistration} from "../registerRoutes.js";
import {MovieBrowseRoutes} from "../../../domains/movie/routing/client/MovieBrowseRoutes.js";
import {TheatreBrowseRoutes} from "../../../domains/theatre/routing/TheatreBrowseRoutes.js";
import {ScreenBrowseRoutes} from "../../../domains/screen/routing/ScreenBrowseRoutes.js";
import {ReserveTicketsRoutes} from "@domains/reservation/features/reserve-tickets/routes/routes";
import {UserProfileRoutes} from "../../../domains/users/routing/UserProfileRoutes.js";
import {MyMovieReviewsRoutes} from "../../../domains/movieReview/routes/MyMovieReviewsRoutes.js";
import {FetchClientReservationRoutes} from "@domains/reservation/features/fetch-client-reservations/routes";
import {UpdateClientReservationRoutes} from "@domains/reservation/features/client-reservations/routes";

/**
 * Mounts all primary routes intended for end-user consumption.
 * @param app - The primary Express application instance.
 */
export function registerClientRoutes(app: Express) {
    const routes: RouteRegistration[] = [
        {path: "/api/v1/browse/movies", router: MovieBrowseRoutes},
        {path: "/api/v1/browse/theatres", router: TheatreBrowseRoutes},
        {path: "/api/v1/browse/screens", router: ScreenBrowseRoutes},

        {path: "/api/v1/feat/reserve-tickets", router: ReserveTicketsRoutes},
        {path: "/api/v1/feat/fetch-client-reservations", router: FetchClientReservationRoutes},
        {path: "/api/v1/feat/update-client-reservations", router: UpdateClientReservationRoutes},

        {path: "/api/v1/profile", router: UserProfileRoutes},
        {path: "/api/v1/user/reviews", router: MyMovieReviewsRoutes},
    ];

    for (const {path, router} of routes) {
        app.use(path, router);
    }
}