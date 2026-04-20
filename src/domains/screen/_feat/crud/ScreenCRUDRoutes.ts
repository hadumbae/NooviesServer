/**
 * @fileoverview Express router configuration for the Screen domain.
 * Provides standard CRUD endpoints and an aggregation query interface.
 */

import {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import isAuth from "@domains/authentication/middleware/isAuth";
import {parseQueryOptions} from "@shared/_feat/middleware";
import {create, destroy, find, findById, findBySlug, paginated, update} from "@shared/_feat/generic-crud/path-handlers";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";
import type {ScreenSchemaFields} from "@domains/screen/models/screen/Screen.types";
import {ScreenQueryOptionsSchema} from "@domains/screen/_feat/validate-query/ScreenQueryOption.schema";
import {ScreenInputSchema} from "@domains/screen/schema/ScreenInputSchema";
import Screen from "@domains/screen/models/screen/Screen.model";

/**
 * CRUD route definitions for the Screen entity.
 */
const routes: CRUDRoute<ScreenSchemaFields>[] = [
    {
        /** Basic retrieval based on query filters. */
        path: "/find",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: ScreenQueryOptionsSchema, modelName: Screen.modelName})
        ],
        handler: find
    },
    {
        /** Paginated retrieval for UI tables and infinite scrolls. */
        path: "/paginated",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: ScreenQueryOptionsSchema, modelName: Screen.modelName})
        ],
        handler: paginated
    },
    {
        /** Creation of a new Screen instance. */
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(ScreenInputSchema)],
        handler: create
    },
    {
        /** Retrieval of a specific Screen by Object ID. */
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        /** Retrieval of a specific Screen by slug. */
        path: `/item/:slug/slug`,
        method: "get",
        middleware: [isAuth],
        handler: findBySlug
    },
    {
        /** Partial update of an existing Screen record. */
        path: `/item/:_id`,
        method: "patch",
        middleware: [isAuth, validateZodSchema(ScreenInputSchema)],
        handler: update
    },
    {
        /** Permanent deletion of a Screen record. */
        path: `/item/:_id`,
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

/**
 * Orchestrates the creation of the router with generic path handlers.
 */
const router: Router = buildCRUDRoutes<ScreenSchemaFields>({
    model: Screen,
    routes: routes,
});

/**
 * Custom aggregation endpoint for complex queries and data reporting.
 */
router.get(
    "/query",
    [isAuth, parseQueryOptions({schema: ScreenQueryOptionsSchema, modelName: Screen.modelName})],
    asyncHandler(aggregate({model: Screen})),
);

export {
    router as ScreenCRUDRoutes,
};