import type {Express} from "express";
import AuthRoutes from "../../domains/authentication/routing/AuthRoutes.js";
import PersonRoutes from "../../domains/person/routing/PersonRoutes.js";

const registerRoutes = (app: Express) => {
    app.use("/auth", AuthRoutes);
    app.use("/api/v1/persons", PersonRoutes);
};

export default registerRoutes;