/**
 * @fileoverview Express router configuration for the SeatMap domain.
 * Provides standard CRUD endpoints and specialized aggregation query interfaces
 * for managing real-time seat availability and inventory.
 */

import {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import isAuth from "@domains/authentication/middleware/isAuth";
import {parseQueryOptions} from "@shared/_feat/middleware";
import {create, destroy, find, findById, paginated, update} from "@shared/_feat/generic-crud/path-handlers";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";
import type {SeatMapSchemaFields} from "@domains/seatmap/model/SeatMap.types";
import SeatMap from "@domains/seatmap/model/SeatMap.model";
import {SeatMapInputSchema} from "@domains/seatmap/schema/SeatMapInput.schema";
import {SeatMapQueryOptionsSchema} from "@domains/seatmap/_feat/validate-query";

/**
 * CRUD route definitions for the SeatMap entity.
 */
const routes: CRUDRoute<SeatMapSchemaFields>[] = [
    {
        /** Basic retrieval of seat mappings based on query filters (e.g., all seats for a specific showtime). */
        path: "/find",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: SeatMapQueryOptionsSchema, modelName: SeatMap.modelName})
        ],
        handler: find
    },
    {
        /** Paginated retrieval optimized for administrative inventory logs or large-scale seating audits. */
        path: "/paginated",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: SeatMapQueryOptionsSchema, modelName: SeatMap.modelName})
        ],
        handler: paginated
    },
    {
        /** Manual creation of a seat map entry (typically handled by automated scheduling logic). */
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(SeatMapInputSchema)],
        handler: create
    },
    {
        /** Retrieval of a specific seat map record by its MongoDB Object ID. */
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        /** Update of a seat's availability, status, or pricing for a specific showing. */
        path: `/item/:_id`,
        method: "patch",
        middleware: [isAuth, validateZodSchema(SeatMapInputSchema)],
        handler: update
    },
    {
        /** Permanent removal of a seat mapping entry. */
        path: `/item/:_id`,
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

/**
 * Orchestrates the creation of the router using the generic CRUD utility factory.
 */
const router: Router = buildCRUDRoutes<SeatMapSchemaFields>({
    model: SeatMap,
    routes: routes,
});

/**
 * Advanced aggregation endpoint for complex seating chart queries.
 */
router.get(
    "/query",
    [isAuth, parseQueryOptions({schema: SeatMapQueryOptionsSchema, modelName: SeatMap.modelName})],
    asyncHandler(aggregate({model: SeatMap})),
);

export {
    router as SeatMapCRUDRoutes,
};