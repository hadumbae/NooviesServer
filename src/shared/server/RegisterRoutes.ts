import type {Express} from "express";
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
import MovieFavouriteRoutes from "../../domains/movie/routing/MovieFavouriteRoutes.js";
import MovieCreditRoutes from "../../domains/movieCredit/routing/MovieCreditRoutes.js";
import RoleTypeRoutes from "../../domains/roleType/routing/RoleTypeRoutes.js";

const registerRoutes = (app: Express) => {
    app.use("/auth", AuthRoutes);
    app.use("/api/v1/users", UserRoutes);

    app.use("/api/v1/admin/persons", PersonRoutes);

    app.use("/api/v1/admin/movies", MovieRoutes);
    app.use("/api/v1/admin/movies", MovieFavouriteRoutes);

    app.use("/api/v1/admin/roletypes", RoleTypeRoutes);
    app.use("/api/v1/admin/movie/credits", MovieCreditRoutes);

    app.use("/api/v1/admin/genres", GenreRoutes);
    app.use("/api/v1/admin/showings", ShowingRoutes);

    app.use("/api/v1/admin/seats", SeatRoutes);
    app.use("/api/v1/admin/screens", ScreenRoutes);
    app.use("/api/v1/admin/theatres", TheatreRoutes);
    app.use("/api/v1/admin/seatmaps", SeatMapRoutes);
};

export default registerRoutes;