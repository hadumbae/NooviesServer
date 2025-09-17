import GenreServiceProvider from "../provider/GenreServiceProvider.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
} from "../../../shared/routing/BaseRoutes.js";
import {GenreInputSchema} from "../schema/GenreInputSchema.js";
import validateZodSchemaAsync from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import UnsetModelFormFields from "../../../shared/utility/UnsetModelFormFields.js";

/**
 * Extract the Genre model and controller from the service provider.
 */
const { model, controllers: {controller} } = GenreServiceProvider.register();

/**
 * Middleware to unset any unnecessary or undefined model fields
 * before saving to the database.
 */
const unsetMiddleware = UnsetModelFormFields({model});

/**
 * Defines the route-specific middleware for the Genre routes.
 *
 * - `create`: Middleware applied to the create route, including:
 *    1. Validation against `GenreInputSchema` using Zod.
 *    2. Removal of any undefined or extraneous fields via `unsetMiddleware`.
 *
 * - `update`: Middleware applied to the update route, identical to create.
 *
 * @type {BaseRouteMiddleware<typeof controller>}
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [validateZodSchemaAsync(GenreInputSchema), unsetMiddleware],
        update: [validateZodSchemaAsync(GenreInputSchema), unsetMiddleware],
    }
};

/**
 * Generates the base CRUD routes for the Genre controller.
 *
 * @remarks
 * Uses `createBaseRoutes` from the shared routing module and applies
 * the `middlewareList` to the respective routes.
 *
 * @returns A configured Express router with Genre CRUD endpoints.
 */
const routes = createBaseRoutes({
    crudController: controller,
    middlewareList,
});

export default routes;
