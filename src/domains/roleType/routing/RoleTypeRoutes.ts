import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type BaseRouteConfig
} from "../../../shared/routing/BaseRoutes.js";
import RoleTypeServiceProvider from "../provider/RoleTypeServiceProvider.js";
import {RoleTypeInputSchema} from "../schemas/RoleTypeInput.schema.js";
import validateZodSchema from "../../../shared/utility/schema/validators/validateZodSchema.js";
import unsetModelFormFields from "../../../shared/utility/mongoose/unsetModelFormFields.js";

/**
 * Destructure the RoleType components from the service provider.
 */
const {model, controllers: {controller}} = RoleTypeServiceProvider.register();

/**
 * Middleware to remove or unset specific model form fields before saving/updating.
 */
const unsetMiddleware = unsetModelFormFields({model});

/**
 * Middleware configuration for RoleType routes.
 *
 * @type {BaseRouteMiddleware<typeof controller>}
 * @description
 * Defines middleware for different CRUD operations. For `create` and `update`,
 * it validates the request body using Zod schema and unsets any restricted model fields.
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [validateZodSchema(RoleTypeInputSchema), unsetMiddleware],
        update: [validateZodSchema(RoleTypeInputSchema), unsetMiddleware],
    }
};

/**
 * Configuration object for base routes.
 *
 * @type {BaseRouteConfig}
 * @description
 * Provides the CRUD controller and associated middleware for automatic route creation.
 */
const baseConfig: BaseRouteConfig = {
    crudController: controller,
    middlewareList,
};

/**
 * Creates the base routes for RoleType using the provided configuration.
 */
const routes = createBaseRoutes(baseConfig);

export default routes;
