import express, {type RequestHandler} from "express";
import asyncHandler from "../utility/AsyncHandler.js";
import isAuth from "../../domains/authentication/middleware/isAuth.js";
import type {IBaseCRUDController} from "../controller/base-crud-controller/BaseCRUDController.types.js";

/**
 * Configuration object for creating standard CRUD routes.
 *
 * @typeParam TController - A controller implementing {@link IBaseCRUDController}.
 * Defaults to {@link IBaseCRUDController} if not specified.
 */
export interface IBaseRoutesConfig<TController extends IBaseCRUDController = IBaseCRUDController> {
    /** Controller instance implementing CRUD operations. */
    crudController: TController;

    /** Express middleware for validating creation requests. */
    createValidator: RequestHandler;

    /** Express middleware for validating update requests. */
    updateValidator: RequestHandler;
}

/**
 * Creates standard CRUD routes for a given controller.
 *
 * Automatically sets up routes for:
 * - GET `/all` → retrieves all items
 * - GET `/paginated` → retrieves paginated items
 * - POST `/create` → creates a new item
 * - GET `/get/:_id` → retrieves a single item by ID
 * - PATCH `/update/:_id` → updates an item by ID
 * - DELETE `/delete/:_id` → deletes an item by ID
 * - GET `/query` → executes an aggregate query
 *
 * All routes use authentication middleware (`isAuth`) and async handling.
 *
 * @typeParam TController - Type of the controller implementing {@link IBaseCRUDController}.
 * @param config - Configuration object containing the controller and validators.
 * @returns An Express `Router` configured with the CRUD routes.
 *
 * @example
 * ```ts
 * import { createBaseRoutes } from './BaseRoutes';
 * import MyController from './MyController';
 *
 * const myRoutes = createBaseRoutes({
 *   crudController: new MyController(),
 *   createValidator: myCreateValidator,
 *   updateValidator: myUpdateValidator,
 * });
 *
 * app.use('/items', myRoutes);
 * ```
 */
export const createBaseRoutes = <TController extends IBaseCRUDController>(config: IBaseRoutesConfig<TController>) => {
    const {
        crudController,
        createValidator,
        updateValidator,
    } = config;

    const router = express.Router();

    router.get('/all', isAuth, asyncHandler(crudController.all.bind(crudController)));

    router.get('/paginated', isAuth, asyncHandler(crudController.paginated.bind(crudController)));

    router.post('/create', [isAuth, createValidator], asyncHandler(crudController.create.bind(crudController)));

    router.get('/get/:_id', isAuth, asyncHandler(crudController.get.bind(crudController)));

    router.patch('/update/:_id', [isAuth, updateValidator], asyncHandler(crudController.update.bind(crudController)));

    router.delete('/delete/:_id', isAuth, asyncHandler(crudController.delete.bind(crudController)));

    router.get('/query', isAuth, asyncHandler(crudController.query.bind(crudController)));

    return router;
};
