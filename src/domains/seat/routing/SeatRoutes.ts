import SeatServiceProvider from "../provider/SeatServiceProvider.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type BaseRouteConfig
} from "../../../shared/routing/BaseRoutes.js";
import type {ISeatController} from "../controller/SeatController.js";
import {SeatInputSchema} from "../schema/seats/SeatInput.js";
import unsetModelFormFields from "../../../shared/utility/mongoose/unsetModelFormFields.js";
import validateZodSchemaAsync from "../../../shared/utility/schema/validators/validateZodSchemaAsync.js";

/** Destructures the seat model and controller from the service provider. */
const {model, controllers: {controller}} = SeatServiceProvider.register();

/** Middleware to strip undefined or disallowed fields from requests. */
const unsetMiddleware = unsetModelFormFields({model});

/**
 * Route-specific middleware configuration for the seat controller.
 *
 * - **create**: Validates incoming data against {@link SeatInputSchema}
 *   and applies {@link unsetMiddleware}.
 * - **update**: Same validation and cleanup logic as `create`.
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [validateZodSchemaAsync(SeatInputSchema), unsetMiddleware],
        update: [validateZodSchemaAsync(SeatInputSchema), unsetMiddleware],
    }
};

/**
 * Base configuration object for generating standard CRUD seat routes.
 *
 * @typeParam ISeatController - Interface describing the seat controller.
 */
const baseConfig: BaseRouteConfig<ISeatController> = {
    crudController: controller,
    middlewareList,
};

/**
 * Express router instance for handling `Seat` resources.
 *
 * Includes:
 * - Auto-generated CRUD routes via {@link createBaseRoutes}.
 * - Custom route for batch-creating seats by row.
 *
 * @example
 * ```ts
 * import seatRoutes from "./routes/SeatRoutes.js";
 * app.use("/seats", seatRoutes);
 * ```
 */
const routes = createBaseRoutes<ISeatController>(baseConfig);

export default routes;
