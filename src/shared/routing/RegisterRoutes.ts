import type {Express} from "express";
import AuthRoutes from "../../domains/authentication/routing/AuthRoutes.js";
import PersonRoutes from "../../domains/person/routing/PersonRoutes.js";
import MovieRoutes from "../../domains/movie/routing/MovieRoutes.js";
import SeatRoutes from "../../domains/seat/routing/SeatRoutes.js";
import ScreenRoutes from "../../domains/screen/routing/ScreenRoutes.js";
import TheatreRoutes from "../../domains/theatre/routing/TheatreRoutes.js";
import ShowingRoutes from "../../domains/showing/routing/ShowingRoutes.js";
import GenreRoutes from "../../domains/genre/routing/GenreRoutes.js";

const registerRoutes = (app: Express) => {
    app.use("/auth", AuthRoutes);

    app.use("/api/v1/persons", PersonRoutes);
    app.use("/api/v1/movies", MovieRoutes);
    app.use("/api/v1/genres", GenreRoutes);

    app.use("/api/v1/seats", SeatRoutes);
    app.use("/api/v1/screens", ScreenRoutes);
    app.use("/api/v1/theatres", TheatreRoutes);
    app.use("/api/v1/showings", ShowingRoutes);
};

export default registerRoutes;