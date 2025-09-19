import SeatServiceProvider from "../provider/SeatServiceProvider.js";
import {
    type BaseRouteMiddleware,
    createBaseRoutes,
    type IBaseRoutesConfig
} from "../../../shared/routing/BaseRoutes.js";
import type {ISeatController} from "../controller/SeatController.js";
import ZodAsyncValidator from "../../../shared/utility/zod/validateZodSchemaAsync.js";
import isAuth from "../../authentication/middleware/isAuth.js";
import asyncHandler from "../../../shared/utility/AsyncHandler.js";
import {SeatInputSchema, SeatsByRowInputSchema} from "../schema/seats/SeatInput.schema.js";
import UnsetModelFormFields from "../../../shared/utility/UnsetModelFormFields.js";
import validateZodSchemaAsync from "../../../shared/utility/zod/validateZodSchemaAsync.js";

/** Destructures the seat model and controller from the service provider. */
const {model, controllers: {controller}} = SeatServiceProvider.register();

/** Middleware to strip undefined or disallowed fields from requests. */
const unsetMiddleware = UnsetModelFormFields({model});

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
const baseConfig: IBaseRoutesConfig<ISeatController> = {
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

/**
 * POST `/create/by-row`
 *
 * Creates multiple seats in bulk based on row information.
 *
 * Middleware:
 * - {@link isAuth} – Ensures the request is authenticated.
 * - {@link ZodAsyncValidator} – Validates request body against {@link SeatsByRowInputSchema}.
 * - {@link asyncHandler} – Wraps the controller to properly handle async errors.
 *
 * Handler:
 * - {@link ISeatController.createSeatsByRow}
 */
routes.post(
    "/create/by-row",
    [isAuth, ZodAsyncValidator(SeatsByRowInputSchema)],
    asyncHandler(controller.createSeatsByRow.bind(controller))
);

export default routes;
