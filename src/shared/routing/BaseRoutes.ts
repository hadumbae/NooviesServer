import express, { type RequestHandler, type Router } from "express";
import asyncHandler from "../utility/handlers/asyncHandler.js";
import isAuth from "../../domains/authentication/middleware/isAuth.js";
import type { BaseControllerCRUDMethods } from "../controller/base-crud-controller/BaseControllerCRUDMethods.js";
import type { BaseRouteMethods, BaseRoutePathKeys } from "./BaseRoute.types.js";

/**
 * Route definition bound to a CRUD controller method.
 *
 * @template TController - CRUD controller type.
 */
type RoutePath<TController extends BaseControllerCRUDMethods> = {
    /** Logical route identifier. */
    key: BaseRoutePathKeys;
    /** HTTP method used for the route. */
    method: BaseRouteMethods;
    /** Express route path. */
    path: string;
    /** Controller method name to bind. */
    fn: keyof TController;
};

/**
 * Middleware configuration for CRUD routes.
 *
 * Supports:
 * - Global middleware applied to all routes
 * - Route-specific middleware bound to controller methods
 *
 * @template TController - CRUD controller type.
 */
export type BaseRouteMiddleware<TController extends BaseControllerCRUDMethods> = {
    /** Middleware applied to every route. */
    all?: RequestHandler[];
    /** Middleware applied per controller method. */
    path?: Partial<Record<keyof TController, RequestHandler[]>>;
};

/**
 * Configuration object for {@link createBaseRoutes}.
 *
 * @template TController - CRUD controller type.
 */
export interface BaseRouteConfig<
    TController extends BaseControllerCRUDMethods = BaseControllerCRUDMethods
> {
    /** Controller instance implementing CRUD methods. */
    crudController: TController;
    /** Optional middleware configuration. */
    middlewareList?: BaseRouteMiddleware<TController>;
}

/**
 * Create a standardized CRUD router for a controller.
 *
 * Automatically:
 * - Binds controller methods to routes
 * - Wraps handlers with async error handling
 * - Applies authentication and configured middleware
 * - Allows selective route exclusion
 *
 * @template TController - CRUD controller type.
 * @param config - Route configuration
 * @param excludeKeys - Route keys to exclude from registration
 * @returns Express router instance
 */
export const createBaseRoutes = <
    TController extends BaseControllerCRUDMethods
>(
    config: BaseRouteConfig<TController>,
    excludeKeys: BaseRoutePathKeys[] = [],
): Router => {
    const { crudController, middlewareList } = config;
    const { all: allMiddleware, path: pathMiddleware } = middlewareList || {};

    /**
     * Bind a controller method and wrap it with async handling.
     *
     * @param fn - Controller method name
     */
    const bind = (fn: keyof TController) =>
        asyncHandler(
            (crudController[fn] as (...args: any[]) => Promise<any>)
                .bind(crudController),
        );

    const router = express.Router();

    const routes: RoutePath<TController>[] = [
        { key: "all", method: "get", path: "/all", fn: "all" },
        { key: "paginated", method: "get", path: "/paginated", fn: "paginated" },
        { key: "create", method: "post", path: "/create", fn: "create" },
        { key: "get", method: "get", path: "/get/:_id", fn: "get" },
        { key: "slug", method: "get", path: "/slug/:slug", fn: "getBySlug" },
        { key: "update", method: "patch", path: "/update/:_id", fn: "update" },
        { key: "delete", method: "delete", path: "/delete/:_id", fn: "delete" },
        { key: "query", method: "get", path: "/query", fn: "query" },
    ];

    for (const { key, method, path, fn } of routes) {
        if (excludeKeys.includes(key)) {
            continue;
        }

        const middleware = [
            isAuth,
            ...(allMiddleware ?? []),
            ...(pathMiddleware?.[fn] ?? []),
        ];

        router[method](path, middleware, bind(fn));
    }

    return router;
};
