/**
 * @file Registration utility for client-facing public and protected API routes.
 * @filename registerClientRoutes.ts
 */

import type {Express} from "express";
import type {RouteRegistration} from "../../registerRoutes";
import {ScreenBrowseRoutes} from "@domains/screen/_feat/view-data-client/routes/ScreenBrowseRoutes";
import {UserProfileRoutes} from "@domains/users/routing/UserProfileRoutes";
import {FetchClientReservationRoutes} from "@domains/reservation/_feat/fetch-client-reservations/routes";
import {TheatreSearchRoutes} from "@domains/theatre/_feat/search-theatres";
import {ReviewsByMovieRoutes} from "@domains/movie/_feat/fetch-reviews-by-movie";
import {ReserveTicketsRoutes} from "@domains/reservation/_feat/reserve-tickets";
import {UpdateClientReservationRoutes} from "@domains/reservation/_feat/update-client-reservations";
import {MyMovieReviewsRoutes} from "@domains/movieReview/_feat/current-user-reviews";

/**
 * Mounts all primary routes intended for end-user consumption.
 * @param app - The primary Express application instance.
 */
export function registerClientRoutes(app: Express) {
    const routes: RouteRegistration[] = [
        {path: "/api/v1/browse/screens", router: ScreenBrowseRoutes},

        {path: "/api/v1/feat/reviews-by-movie", router: ReviewsByMovieRoutes},
        {path: "/api/v1/feat/reserve-tickets", router: ReserveTicketsRoutes},
        {path: "/api/v1/feat/fetch-client-reservations", router: FetchClientReservationRoutes},
        {path: "/api/v1/feat/update-client-reservations", router: UpdateClientReservationRoutes},
        {path: "/api/v1/feat/search-theatres", router: TheatreSearchRoutes},

        {path: "/api/v1/profile", router: UserProfileRoutes},
        {path: "/api/v1/user/reviews", router: MyMovieReviewsRoutes},
    ];

    for (const {path, router} of routes) {
        app.use(path, router);
    }
}