import TheatreServiceProvider from "../provider/TheatreServiceProvider.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type BaseRouteConfig
} from "../../../shared/routing/BaseRoutes.js";
import type {ITheatreController} from "../controller/TheatreController.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import ScreenServiceProvider from "../../screen/provider/ScreenServiceProvider.js";
import {TheatreInputSchema} from "../schema/TheatreSchema.js";
import validateZodSchemaAsync from "../../../shared/utility/schema/validators/validateZodSchemaAsync.js";
import unsetModelFormFields from "../../../shared/utility/mongoose/unsetModelFormFields.js";

/**
 * Extract the Theatre model and controller from the service provider.
 */
const { model, controllers: {controller: theatreController} } = TheatreServiceProvider.register();

/**
 * Extract the Screen controller from the Screen service provider
 * to support Theatre-related routes that also expose Screen data.
 */
const { controllers: {controller: screenController} } = ScreenServiceProvider.register();

/**
 * Middleware that removes unset/undefined fields before Theatre documents
 * are persisted to the database.
 */
const unsetMiddleware = unsetModelFormFields({model});

/**
 * Route-specific middleware for Theatre CRUD operations.
 *
 * - **create**:
 *   1. Validates the request body against {@link TheatreInputSchema}.
 *   2. Removes unset/undefined fields via {@link unsetMiddleware}.
 *
 * - **update**:
 *   Same as create, ensuring all update requests are validated and sanitized.
 *
 * @type {BaseRouteMiddleware<typeof theatreController>}
 */
const middlewareList: BaseRouteMiddleware<typeof theatreController> = {
    path: {
        create: [validateZodSchemaAsync(TheatreInputSchema), unsetMiddleware],
        update: [validateZodSchemaAsync(TheatreInputSchema), unsetMiddleware],
    },
};

/**
 * Base configuration for generating Theatre CRUD routes.
 *
 * @remarks
 * - `crudController` handles the main CRUD logic for Theatres.
 * - `middlewareList` ensures all create/update requests are validated
 *   and cleaned before being processed.
 *
 * @type {BaseRouteConfig<ITheatreController>}
 */
const baseConfig: BaseRouteConfig<ITheatreController> = {
    crudController: theatreController,
    middlewareList
};

/**
 * Theatre routes.
 *
 * @remarks
 * - Automatically generates Theatre CRUD endpoints using {@link createBaseRoutes}.
 * - Adds a custom endpoint for retrieving Screens associated with a Theatre.
 *
 * @returns An Express router with Theatre CRUD and custom routes.
 */
const routes = createBaseRoutes<ITheatreController>(baseConfig);

/**
 * GET /get/:_id/screens
 *
 * @description Retrieves all Screens belonging to a specific Theatre (by `_id`).
 *
 * @middleware
 * - {@link asyncHandler}: Ensures async errors are properly caught and handled.
 */
routes.get('/get/:_id/screens', asyncHandler(screenController.getScreensByTheatre.bind(screenController)));

export default routes;
