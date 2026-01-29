/**
 * @file Reservation.routes.ts
 *
 * Route registration for Reservation resources.
 *
 * Wires the Reservation controller into the shared CRUD
 * routing system, applying validation and mutation middleware
 * where appropriate.
 *
 * Responsibilities:
 * - Registers the Reservation service provider
 * - Binds the Reservation controller to base CRUD routes
 * - Applies Zod validation and form-field sanitization
 * - Excludes unsupported routes from exposure
 */

import { ReservationServiceProvider } from "../providers/ReservationServiceProvider.js";
import unsetModelFormFields from "../../../shared/utility/mongoose/unsetModelFormFields.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
} from "../../../shared/routing/BaseRoutes.js";
import validateZodSchemaAsync from "../../../shared/utility/schema/validators/validateZodSchemaAsync.js";
import { ReservationInputSchema } from "../schemas/ReservationInputSchema.js";
import type { ShowingControllerMethods } from "../../showing/controller/ShowingController.js";

/**
 * Register Reservation domain services and controllers.
 */
const {
    model,
    controllers: { controller },
} = ReservationServiceProvider.register();

/**
 * Middleware to unset non-updatable form fields on mutation.
 *
 * @remarks
 * Preserves the immutable reservation snapshot during updates.
 */
const unsetMiddleware = unsetModelFormFields({
    model,
    excludeKeys: ["snapshot"],
});

/**
 * Route-specific middleware configuration.
 *
 * @remarks
 * - `update`: validates input and strips disallowed fields
 */
const middlewareList: BaseRouteMiddleware<typeof controller> = {
    path: {
        update: [
            validateZodSchemaAsync(ReservationInputSchema),
            unsetMiddleware,
        ],
    },
};

/**
 * Reservation CRUD routes.
 *
 * @remarks
 * - Uses the shared base route factory
 * - Disables creation via this router
 */
const routes = createBaseRoutes<ShowingControllerMethods>(
    {crudController: controller, middlewareList},
    ["create"],
);

export {
    routes as ReservationRoutes
}
