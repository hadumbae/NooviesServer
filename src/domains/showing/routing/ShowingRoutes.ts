import ShowingServiceProvider from "../provider/ShowingServiceProvider.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type BaseRouteConfig
} from "../../../shared/routing/BaseRoutes.js";
import type { ShowingControllerMethods } from "../controller/ShowingController.js";
import { ShowingInputSchema } from "../schema/ShowingInputSchema.js";
import unsetModelFormFields from "../../../shared/utility/mongoose/unsetModelFormFields.js";
import validateZodSchemaAsync from "../../../shared/utility/schema/validators/validateZodSchemaAsync.js";

/**
 * Registers the Showing service and extracts
 * the model and CRUD controller.
 */
const {
    model,
    controllers: { controller },
} = ShowingServiceProvider.register();

/**
 * Middleware that removes unset form fields
 * before persistence.
 *
 * @remarks
 * `startTime` and `endTime` are excluded to allow
 * intentional partial updates.
 */
const unsetMiddleware = unsetModelFormFields({
    model,
    excludeKeys: ["startTime", "endTime"],
});

/**
 * Route-specific middleware configuration
 * for Showing CRUD endpoints.
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [
            validateZodSchemaAsync(ShowingInputSchema),
        ],
        update: [
            validateZodSchemaAsync(ShowingInputSchema),
            unsetMiddleware,
        ],
    },
};

/**
 * Base route configuration for the Showing domain.
 */
const baseConfig: BaseRouteConfig<ShowingControllerMethods> = {
    crudController: controller,
    middlewareList,
};

/**
 * Express router for Showing CRUD operations.
 *
 * @remarks
 * Routes are auto-generated via {@link createBaseRoutes}
 * and include validation and sanitization middleware.
 *
 * @example
 * ```ts
 * app.use("/showings", routes);
 * ```
 */
const routes = createBaseRoutes<ShowingControllerMethods>(baseConfig);

export default routes;
