import ShowingServiceProvider from "../provider/ShowingServiceProvider.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type IBaseRoutesConfig
} from "../../../shared/routing/BaseRoutes.js";
import type {IShowingController} from "../controller/ShowingController.js";
import {ShowingSubmitSchema} from "../schema/ShowingSubmitSchema.js";
import UnsetModelFormFields from "../../../shared/utility/UnsetModelFormFields.js";
import validateZodSchemaAsync from "../../../shared/utility/zod/validateZodSchemaAsync.js";

/**
 * Extract the Showing controller and model from the Showing service provider
 * to configure routes and apply request validation.
 */
const {model, controllers: {controller}} = ShowingServiceProvider.register();

/**
 * Middleware that removes unset/undefined fields before Showing documents
 * are persisted to the database.
 */
const unsetMiddleware = UnsetModelFormFields({model});

/**
 * Middleware list specific to the `Showing` routes.
 *
 * - **create**: Validates the request body against {@link ShowingSubmitSchema}
 *   and unsets unexpected form fields before creating a showing.
 * - **update**: Same validation and sanitization logic applied when updating.
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [validateZodSchemaAsync(ShowingSubmitSchema), unsetMiddleware],
        update: [validateZodSchemaAsync(ShowingSubmitSchema), unsetMiddleware],
    }
};

/**
 * Base configuration for `Showing` routes.
 *
 * @property crudController - The controller handling showing CRUD operations.
 * @property middlewareList - Middleware hooks applied to specific CRUD routes.
 */
const baseConfig: IBaseRoutesConfig<IShowingController> = {
    crudController: controller,
    middlewareList,
};

/**
 * Express router for `Showing` domain.
 *
 * Provides automatically generated CRUD routes via {@link createBaseRoutes},
 * and defines additional domain-specific endpoints such as fetching seats
 * for a particular showing.
 *
 * ### Routes
 * - `POST /create` → Create a new showing (with validation + field sanitization)
 * - `PUT /update/:id` → Update a showing (with validation + field sanitization)
 * - `GET /get/:id` → Fetch a showing by ID
 * - `DELETE /delete/:id` → Delete a showing
 *
 * @example
 * ```ts
 * import showingRoutes from "./routes/ShowingRoutes.js";
 * app.use("/showings", showingRoutes);
 * ```
 */
const routes = createBaseRoutes<IShowingController>(baseConfig);

export default routes;
