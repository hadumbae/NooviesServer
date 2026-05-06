/**
 * @fileoverview Express router configuration for the Screen domain.
 * Provides standard CRUD endpoints and an aggregation query interface.
 */

import {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import isAuth from "@domains/authentication/middleware/isAuth";
import {buildAuthCRUDQueryMiddleware} from "@shared/_feat/middleware";
import {create, destroy, find, findById, findBySlug, paginated, update} from "@shared/_feat/generic-crud/path-handlers";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";
import {Screen, type ScreenSchemaFields} from "@domains/screen/models/screen";
import {ScreenPopulationPaths, ScreenPopulationPipelines, ScreenVirtualPipelines} from "../query-population";
import {ScreenInputSchema} from "@domains/screen/_feat/validate-submit";
import {ScreenQueryMatchStageSchema, ScreenQuerySortStageSchema} from "@domains/screen/_feat/validate-query";
import validateZodSchemaAsync from "@shared/utility/schema/validators/validateZodSchemaAsync";

const modelName = Screen.modelName;
const matchSchema = ScreenQueryMatchStageSchema;
const sortSchema = ScreenQuerySortStageSchema;

/**
 * CRUD route definitions for the Screen entity.
 */
const routes: CRUDRoute<ScreenSchemaFields>[] = [
    {
        /** Basic retrieval based on query filters. */
        path: "/find",
        method: "get",
        middleware: buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
        handler: find
    },
    {
        /** Paginated retrieval for UI tables and infinite scrolls. */
        path: "/paginated",
        method: "get",
        middleware: buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
        handler: paginated
    },
    {
        /** Creation of a new Screen instance. */
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchemaAsync(ScreenInputSchema)],
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
        middleware: [isAuth, validateZodSchemaAsync(ScreenInputSchema)],
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
    populatePaths: ScreenPopulationPaths,
});

/**
 * Custom aggregation endpoint for complex queries and data reporting.
 */
router.get(
    "/query",
    buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
    asyncHandler(aggregate({
        model: Screen,
        virtualsPipelines: ScreenVirtualPipelines,
        populationPipelines: ScreenPopulationPipelines,
    })),
);

export {
    router as ScreenCRUDRoutes,
};