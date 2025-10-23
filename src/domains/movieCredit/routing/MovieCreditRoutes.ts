import MovieCreditServiceProvider from "../provider/MovieCreditServiceProvider.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type IBaseRoutesConfig
} from "../../../shared/routing/BaseRoutes.js";
import type { IMovieCreditController } from "../controllers/MovieCreditController.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";
import { MovieCreditInputSchema } from "../schemas/MovieCreditInputSchema.js";
import UnsetModelFormFields from "../../../shared/utility/UnsetModelFormFields.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";

/**
 * Initializes the MovieCredit routes by registering all required services,
 * controllers, and middleware.
 *
 * @remarks
 * - Uses {@link MovieCreditServiceProvider} to register model and controller.
 * - Applies input validation using {@link MovieCreditInputSchema}.
 * - Unsets model form fields not allowed for direct modification.
 * - Adds authentication middleware for protected endpoints.
 * - Provides a custom route for fetching movie credits grouped by role type.
 */
const { model, controllers: { controller } } = MovieCreditServiceProvider.register();

/** Middleware that unsets restricted fields on incoming create/update requests */
const unsetMiddleware = UnsetModelFormFields({ model });

/** Middleware configuration for base CRUD routes */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [validateZodSchema(MovieCreditInputSchema), unsetMiddleware],
        update: [validateZodSchema(MovieCreditInputSchema), unsetMiddleware],
    }
};

/** Base route configuration object */
const baseConfig: IBaseRoutesConfig<IMovieCreditController> = {
    crudController: controller,
    middlewareList,
};

/** Router instance providing CRUD routes for MovieCredit */
const router = createBaseRoutes(baseConfig);

/**
 * GET /query/person/:personID/grouped-by-role-type
 *
 * @description
 * Fetches movie credits for a specific person and groups them by role type.
 * - Protected route: requires authentication.
 * - Uses the {@link IMovieCreditController.fetchGroupedMovieCreditsByPerson} method.
 *
 * @param personID - The MongoDB ObjectId of the person whose credits are fetched.
 *
 * @example
 * // GET /query/person/64f8a3b1234abcd5678ef9/grouped-by-role-type
 * fetch("/movie-credits/query/person/64f8a3b1234abcd5678ef9/grouped-by-role-type")
 *   .then(res => res.json())
 *   .then(data => console.log(data));
 */
router.get(
    "/query/person/:personID/grouped-by-role-type",
    [isAuth],
    asyncHandler(controller.fetchGroupedMovieCreditsByPerson.bind(controller)),
);

export default router;
