/**
 * @file SeatRoutes.ts
 *
 * Express routes for Seat resources.
 */

import SeatServiceProvider from "../provider/SeatServiceProvider.js";
import {
    createBaseRoutes,
    type BaseRouteMiddleware,
    type BaseRouteConfig,
} from "../../../shared/routing/BaseRoutes.js";
import type {ISeatController} from "../controller/SeatController.js";
import {SeatInputSchema} from "../schema/seats/SeatInput.js";
import unsetModelFormFields from "../../../shared/utility/mongoose/unsetModelFormFields.js";
import validateZodSchemaAsync from "../../../shared/utility/schema/validators/validateZodSchemaAsync.js";

const {model, controllers: {controller}} = SeatServiceProvider.register();

const unsetMiddleware = unsetModelFormFields({model});

/**
 * Route-level middleware configuration.
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        create: [validateZodSchemaAsync(SeatInputSchema), unsetMiddleware],
        update: [validateZodSchemaAsync(SeatInputSchema), unsetMiddleware],
    },
};

/**
 * Base route configuration for Seat CRUD endpoints.
 */
const baseConfig: BaseRouteConfig<ISeatController> = {
    crudController: controller,
    middlewareList,
};

/**
 * Express router exposing Seat CRUD routes.
 */
const routes = createBaseRoutes<ISeatController>(baseConfig);

export default routes;
