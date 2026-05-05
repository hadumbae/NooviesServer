/**
 * @fileoverview Express router configuration for the Screen domain.
 * Provides standard CRUD endpoints and an aggregation query interface.
 */

import {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import isAuth from "@domains/authentication/middleware/isAuth";
import {buildUnsetFields, parseQueryOptions} from "@shared/_feat/middleware";
import {create, destroy, find, findById, findBySlug, paginated, update} from "@shared/_feat/generic-crud/path-handlers";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";
import {SeatQueryOptionsSchema} from "@domains/seat/_feat/validate-query";
import {SeatInputSchema} from "@domains/seat/_feat/validate-submit";
import {Seat, type SeatSchemaFields} from "@domains/seat/model";

/**
 * CRUD route definitions for the Screen entity.
 */
const routes: CRUDRoute<SeatSchemaFields>[] = [
    {
        /** Basic retrieval based on query filters. */
        path: "/find",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: SeatQueryOptionsSchema, modelName: Seat.modelName})
        ],
        handler: find
    },
    {
        /** Paginated retrieval for UI tables and infinite scrolls. */
        path: "/paginated",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: SeatQueryOptionsSchema, modelName: Seat.modelName})
        ],
        handler: paginated
    },
    {
        /** Creation of a new Screen instance. */
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(SeatInputSchema)],
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
        middleware: [
            isAuth,
            validateZodSchema(SeatInputSchema),
            buildUnsetFields({
                model: Seat,
                excludeKeys: ["row", "x", "y", "layoutType", "theatre", "screen"],
            }),
        ],
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
const router: Router = buildCRUDRoutes<SeatSchemaFields>({
    model: Seat,
    routes: routes,
    populatePaths: ["screen", "theatre"],
});

/**
 * Custom aggregation endpoint for complex queries and data reporting.
 */
router.get(
    "/query",
    [isAuth, parseQueryOptions({schema: SeatQueryOptionsSchema, modelName: Seat.modelName})],
    asyncHandler(aggregate({model: Seat})),
);

export {
    router as SeatCRUDRoutes,
};