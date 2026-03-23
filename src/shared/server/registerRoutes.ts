/**
 * @file registerRoutes.ts
 *
 * Central route registry for the Express application.
 *
 * Defines and mounts all domain-specific routers under their
 * respective base paths, including public browse endpoints,
 * authentication, and admin APIs.
 */

import type {Express, Router} from "express";
import AuthRoutes from "../../domains/authentication/routing/AuthRoutes.js";
import PersonRoutes from "../../domains/person/routing/PersonRoutes.js";
import MovieRoutes from "../../domains/movie/routing/MovieRoutes.js";
import SeatRoutes from "../../domains/seat/routing/SeatRoutes.js";
import ScreenRoutes from "../../domains/screen/routing/ScreenRoutes.js";
import TheatreRoutes from "../../domains/theatre/routing/TheatreRoutes.js";
import ShowingRoutes from "../../domains/showing/routing/ShowingRoutes.js";
import GenreRoutes from "../../domains/genre/routing/GenreRoutes.js";
import UserRoutes from "../../domains/users/routing/UserRoutes.js";
import SeatMapRoutes from "../../domains/seatmap/routing/SeatMapRoutes.js";
import MovieCreditRoutes from "../../domains/movieCredit/routing/MovieCreditRoutes.js";
import RoleTypeRoutes from "../../domains/roleType/routing/RoleTypeRoutes.js";
import {TheatreBrowseRoutes} from "../../domains/theatre/routing/TheatreBrowseRoutes.js";
import {ScreenBrowseRoutes} from "../../domains/screen/routing/ScreenBrowseRoutes.js";
import {ReservationRoutes} from "../../domains/reservation/routes/ReservationRoutes.js";
import {TicketRoutes} from "../../domains/reservation/routes/TicketRoutes.js";
import {ReservationUtilityRoutes} from "../../domains/reservation/routes/ReservationUtilityRoutes.js";
import {UserProfileRoutes} from "../../domains/users/routing/UserProfileRoutes.js";
import {MovieReviewCRUDRoutes} from "../../domains/movieReview/routes/MovieReviewCRUDRoutes.js";
import {MyMovieReviewsRoutes} from "../../domains/movieReview/routes/MyMovieReviewsRoutes.js";
import {MovieBrowseRoutes} from "../../domains/movie/routing/client/MovieBrowseRoutes.js";
import {MovieViewDataRoutes} from "../../domains/movie/routing/client/MovieViewDataRoutes.js";
import {IpApiRoutes} from "../../domains/external/ipapi/routing/IpApiRoutes.js";
import {GenreViewDataRoutes} from "../../domains/genre/routing/GenreViewDataRoutes.js";

/**
 * Internal route registration descriptor.
 */
type RouteRegistration = {
    /** Base URL path for the router */
    path: string;

    /** Express router instance */
    router: Router;
};

/**
 * Ordered list of application route registrations.
 *
 * Order matters:
 * - Public and authentication routes are registered first
 * - Admin routes are grouped and namespaced under `/api/v1/admin`
 */
const adminRegistration: RouteRegistration[] = [
    // --- AUTH ROUTES ---

    {path: "/auth", router: AuthRoutes},
    {path: "/api/v1/users", router: UserRoutes},

    // --- ADMIN ROUTES ---

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
];

const adminViewRegistration: RouteRegistration[] = [
    {path: "/api/v1/admin/genres", router: GenreViewDataRoutes},
];

const clientRegistration: RouteRegistration[] = [
    {path: "/api/v1/browse/movies", router: MovieBrowseRoutes},

    {path: "/api/v1/browse/theatres", router: TheatreBrowseRoutes},
    {path: "/api/v1/browse/screens", router: ScreenBrowseRoutes},

    {path: "/api/v1/reservations/utils", router: ReservationUtilityRoutes},
    {path: "/api/v1/tickets", router: TicketRoutes},

    {path: "/api/v1/profile", router: UserProfileRoutes},

    {path: "/api/v1/user/reviews", router: MyMovieReviewsRoutes},
];

const clientViewRegistration: RouteRegistration[] = [
    {path: "/api/v1/views/desktop/client/movies", router: MovieViewDataRoutes},
];

const externalRegistration: RouteRegistration[] = [
    {path: "/api/v1/ext/ip-geo", router: IpApiRoutes},
];

/**
 * Registers all application routes on the provided Express app.
 *
 * Iterates over the internal route registry and mounts each router
 * at its configured base path.
 *
 * @param app Express application instance
 */
export default function registerRoutes(app: Express) {
    [
        ...adminRegistration,
        ...adminViewRegistration,
        ...clientRegistration,
        ...clientViewRegistration,
        ...externalRegistration,
    ].forEach(({path, router}) => {
        app.use(path, router);
    });
}
