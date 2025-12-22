import ScreenServiceProvider from "../provider/ScreenServiceProvider.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type IBaseRoutesConfig
} from "../../../shared/routing/BaseRoutes.js";
import type {IScreenController} from "../controller/ScreenController.js";
import {ScreenInputSchema} from "../schema/ScreenInputSchema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import unsetModelFormFields from "../../../shared/utility/mongoose/unsetModelFormFields.js";
import validateZodSchemaAsync from "../../../shared/utility/schema/validators/validateZodSchemaAsync.js";

/**
 * Extract the Screen model and controller from the service provider.
 */
const {model, controllers: {controller}} = ScreenServiceProvider.register();

/**
 * Middleware to unset undefined or extraneous fields from the Screen model
 * before persisting data to the database.
 */
const unsetMiddleware = unsetModelFormFields({model});

/**
 * Route-specific middleware for the Screen CRUD operations.
 *
 * - **create**:
 *   1. Validates the request body against {@link ScreenInputSchema}.
 *   2. Removes unset/undefined fields via {@link unsetMiddleware}.
 *
 * - **update**:
 *   Same as create, ensuring incoming data is validated and sanitized.
 *
 * @type {BaseRouteMiddleware<typeof controller>}
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [validateZodSchemaAsync(ScreenInputSchema), unsetMiddleware],
        update: [validateZodSchemaAsync(ScreenInputSchema), unsetMiddleware],
    },
};

/**
 * Base configuration for generating Screen CRUD routes.
 *
 * @remarks
 * The `crudController` handles the logic for each route,
 * while `middlewareList` attaches route-specific middleware.
 *
 * @type {IBaseRoutesConfig<IScreenController>}
 */
const baseConfig: IBaseRoutesConfig<IScreenController> = {
    crudController: controller,
    middlewareList
};

/**
 * Screen routes.
 *
 * @remarks
 * - Automatically generates CRUD routes using {@link createBaseRoutes}.
 * - Includes additional custom endpoints such as:
 *   - `GET /get/:_id/seats/by-row`: Retrieves seats for a specific screen, grouped by row.
 *
 * @returns An Express router with Screen CRUD and custom routes.
 */
const routes = createBaseRoutes<IScreenController>(baseConfig);

/**
 * GET /get/:_id/seats/by-row
 *
 * @description Retrieves all seats for a given screen (by `_id`),
 * organized/grouped by row.
 *
 * @middleware
 * - {@link isAuth}: Ensures the user is authenticated.
 * - {@link asyncHandler}: Wraps controller logic to properly handle async errors.
 */
routes.get(
    `/get/:_id/seats/by-row`,
    isAuth,
    asyncHandler(controller.getSeatsByRow.bind(controller))
);

export default routes;
