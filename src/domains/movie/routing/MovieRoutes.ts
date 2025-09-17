import MovieServiceProvider from "../provider/MovieServiceProvider.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type IBaseRoutesConfig
} from "../../../shared/routing/BaseRoutes.js";
import type { IMovieController } from "../controller/MovieController.js";
import { MovieInputSchema } from "../schema/MovieInputSchema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import { uploadImage } from "@config/image-multr.js";
import hasPosterImage from "../middleware/hasPosterImage.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import UnsetModelFormFields from "../../../shared/utility/UnsetModelFormFields.js";
import validateZodSchemaAsync from "../../../shared/utility/zod/validateZodSchemaAsync.js";

/**
 * Destructure the Movie model and controller from the service provider.
 */
const { model, controllers: { controller } } = MovieServiceProvider.register();

/**
 * Middleware to remove or unset specific model form fields
 * before creating or updating a Movie entity.
 */
const unsetMiddleware = UnsetModelFormFields({ model });

/**
 * Middleware configuration for the base CRUD routes of Movie.
 *
 * @type {BaseRouteMiddleware<typeof controller>}
 * @description
 * Applies Zod schema validation and unsets restricted model fields
 * during `create` and `update` operations.
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [validateZodSchemaAsync(MovieInputSchema), unsetMiddleware],
        update: [validateZodSchemaAsync(MovieInputSchema), unsetMiddleware],
    }
};

/**
 * Configuration object for generating base CRUD routes.
 *
 * @type {IBaseRoutesConfig<IMovieController>}
 */
const baseConfig: IBaseRoutesConfig<IMovieController> = {
    crudController: controller,
    middlewareList
};

/**
 * Base CRUD routes for the Movie entity, automatically generated
 * from the controller and middleware configuration.
 */
const routes = createBaseRoutes(baseConfig);

/**
 * Custom route: Fetch paginated movies with recent showings.
 *
 * Middleware applied:
 * - `isAuth` → ensures the user is authenticated.
 */
routes.get(
    '/query/paginated-with-recent-showings',
    [isAuth],
    asyncHandler(controller.fetchPaginatedMoviesWithRecentShowings.bind(controller)),
);

/**
 * Custom route: Update poster image for a Movie.
 *
 * Middleware applied:
 * - `isAuth` → ensures the user is authenticated.
 * - `uploadImage.single("image")` → handles single file upload.
 * - `hasPosterImage` → validates that a poster image exists.
 */
routes.patch(
    '/update/:_id/poster_image',
    [isAuth, uploadImage.single("image"), hasPosterImage],
    asyncHandler(controller.updatePosterPicture.bind(controller)),
);

/**
 * Custom route: Delete poster image for a Movie.
 *
 * Middleware applied:
 * - `isAuth` → ensures the user is authenticated.
 * - `uploadImage.single("image")` → required for middleware compatibility.
 * - `hasPosterImage` → validates that a poster image exists.
 */
routes.delete(
    '/delete/:_id/poster_image',
    [isAuth, uploadImage.single("image"), hasPosterImage],
    asyncHandler(controller.updatePosterPicture.bind(controller)),
);

export default routes;
