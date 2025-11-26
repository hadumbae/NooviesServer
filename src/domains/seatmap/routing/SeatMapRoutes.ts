import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type IBaseRoutesConfig
} from "../../../shared/routing/BaseRoutes.js";
import type {ISeatMapController} from "../controller/SeatMapController.js";
import {SeatMapSubmitSchema} from "../schema/SeatMapSubmitSchema.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/handlers/asyncHandler.js";
import SeatMapServiceProvider from "../provider/SeatMapServiceProvider.js";
import unsetModelFormFields from "../../../shared/utility/mongoose/unsetModelFormFields.js";
import validateZodSchemaAsync from "../../../shared/utility/schema/validators/validateZodSchemaAsync.js";

/**
 * Extract the SeatMap controller and model from the SeatMap service provider.
 * This centralizes all dependencies needed for route registration.
 */
const {model, controllers: {controller}} = SeatMapServiceProvider.register();

/**
 * Middleware that removes unset or undefined fields before persisting SeatMap documents
 * to the database. This ensures that optional fields are not stored as `undefined`.
 */
const unsetMiddleware = unsetModelFormFields({model});

/**
 * Defines route-specific middleware for CRUD operations.
 * - `create` and `update` paths validate the request body using Zod
 *   and remove unset fields before passing data to the controller.
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [validateZodSchemaAsync(SeatMapSubmitSchema), unsetMiddleware],
        update: [validateZodSchemaAsync(SeatMapSubmitSchema), unsetMiddleware],
    }
};

/**
 * Configuration object for creating base SeatMap routes.
 * Combines the controller and route-specific middleware.
 */
const baseConfig: IBaseRoutesConfig<ISeatMapController> = {
    crudController: controller,
    middlewareList,
};

/**
 * Generates the base CRUD routes for SeatMap using the configuration above.
 */
const routes = createBaseRoutes<ISeatMapController>(baseConfig);

/**
 * Additional custom SeatMap routes for seat map management:
 *
 * POST `/showing/:_id/seating/create` - Creates a seat map for a showing.
 * PATCH `/update/:_id/toggle/availability` - Toggles seat availability.
 *
 * All routes are protected with authentication middleware (`isAuth`) and
 * use `asyncHandler` to handle promise rejections automatically.
 */
routes.post('/showing/:_id/seating/create', isAuth, asyncHandler(controller.createSeatMap.bind(controller)));
routes.patch('/update/:_id/toggle/availability', isAuth, asyncHandler(controller.toggleSeatMapAvailability.bind(controller)));

export default routes;
