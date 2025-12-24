import express, {type RequestHandler, type Router} from "express";
import asyncHandler from "../utility/handlers/asyncHandler.js";
import isAuth from "../../domains/authentication/middleware/isAuth.js";
import type {BaseControllerCRUDMethods} from "../controller/base-crud-controller/BaseControllerCRUDMethods.js";

/**
 * Route definition bound to a CRUD controller method.
 *
 * @template TController - CRUD controller type.
 */
type RoutePath<TController extends BaseControllerCRUDMethods> = {
    /** HTTP method used for the route. */
    method: "get" | "post" | "put" | "patch" | "delete";
    /** Express route path. */
    path: string;
    /** Controller method name to bind. */
    fn: keyof TController;
};

/**
 * Middleware configuration for CRUD routes.
 *
 * Allows:
 * - Global middleware applied to all routes
 * - Route-specific middleware per controller method
 *
 * @template TController - CRUD controller type.
 */
export type BaseRouteMiddleware<TController extends BaseControllerCRUDMethods> = {
    /** Middleware applied to all routes. */
    all?: RequestHandler[];
    /** Middleware applied per controller method. */
    path?: Partial<Record<keyof TController, RequestHandler[]>>;
};

/**
 * Configuration for {@link createBaseRoutes}.
 *
 * @template TController - CRUD controller type.
 */
export interface BaseRouteConfig<TController extends BaseControllerCRUDMethods = BaseControllerCRUDMethods> {
    /** Controller instance implementing CRUD methods. */
    crudController: TController;
    /** Optional middleware configuration. */
    middlewareList?: BaseRouteMiddleware<TController>;
}

/**
 * Create a standardized CRUD router for a controller.
 *
 * Automatically:
 * - Binds controller methods
 * - Wraps handlers with async error handling
 * - Applies authentication and configured middleware
 *
 * @template TController - CRUD controller type.
 * @param config - Route configuration.
 * @returns An Express router instance.
 */
export const createBaseRoutes = <TController extends BaseControllerCRUDMethods>(config: BaseRouteConfig<TController>): Router => {
    const {crudController, middlewareList} = config;
    const {all: allMiddleware, path: pathMiddleware} = middlewareList || {};

    /**
     * Bind a controller method and wrap it in an async handler.
     */
    const bind = (fn: keyof TController) =>
        asyncHandler(
            (crudController[fn] as (...args: any[]) => Promise<any>)
                .bind(crudController),
        );

    /**
     * Prepend authentication middleware to the handler chain.
     */
    const secure = (handlers: RequestHandler[] = []): RequestHandler[] => [
        isAuth,
        ...handlers,
    ];

    const router = express.Router();

    const routes: RoutePath<TController>[] = [
        {method: "get", path: "/all", fn: "all"},
        {method: "get", path: "/paginated", fn: "paginated"},
        {method: "post", path: "/create", fn: "create"},
        {method: "get", path: "/get/:_id", fn: "get"},
        {method: "get", path: "/slug/:slug", fn: "getBySlug"},
        {method: "patch", path: "/update/:_id", fn: "update"},
        {method: "delete", path: "/delete/:_id", fn: "delete"},
        {method: "get", path: "/query", fn: "query"},
    ];

    for (const {method, path, fn} of routes) {
        const middleware = [
            ...(allMiddleware ?? []),
            ...(pathMiddleware?.[fn] ?? []),
        ];

        router[method](path, secure(middleware), bind(fn));
    }

    return router;
};
