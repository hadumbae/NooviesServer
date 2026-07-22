/**
 * @fileoverview Express router configuration for the Showing domain.
 *
 * Provides standard CRUD endpoints and specialized aggregation query interfaces for managing cinema showtimes.
 */

import {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@/shared/_feat/generic-crud/routes";
import isAuth from "@/domains/authentication/middleware/isAuth";
import {buildAuthCRUDQueryMiddleware} from "@/shared/_feat/middleware";
import {create, destroy, find, findById, findBySlug, paginated, update} from "@/shared/_feat/generic-crud/path-handlers";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {aggregate} from "@/shared/_feat/generic-aggregate";
import type {ShowingSchemaFields} from "@/domains/showing/_models/showing/Showing.types";
import {Showing} from "@/domains/showing/_models/showing/Showing.model";
import {ShowingQueryMatchStageSchema, ShowingQuerySortStageSchema} from "@/domains/showing/_feat/validate-query";
import {ShowingInputSchema} from "@/domains/showing/_feat/validate-submit/ShowingInputSchema";
import {ShowingPopulationPaths} from "@/domains/showing/_feat/query-population";
import {ShowingPopulationPipelines} from "@/domains/showing/_feat/query-population/ShowingPopulationPipelines";
import {ShowingSeatMapVirtualPipelines} from "@/domains/showing/_feat/query-population/ShowingSeatMapVirtualPipelines";

const authCRUDMiddleware = buildAuthCRUDQueryMiddleware({
    modelName: Showing.modelName,
    matchSchema: ShowingQueryMatchStageSchema,
    sortSchema: ShowingQuerySortStageSchema,
});

/** CRUD route definitions for the Showing entity. */
const routes: CRUDRoute<ShowingSchemaFields>[] = [
    {
        /** Basic retrieval of showtimes based on IDs or operational status. */
        path: "/find",
        method: "get",
        middleware: authCRUDMiddleware,
        handler: find
    },
    {
        /** Paginated retrieval for theater schedule management tables. */
        path: "/paginated",
        method: "get",
        middleware: authCRUDMiddleware,
        handler: paginated
    },
    {
        /** Creation of a new showtime entry. */
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(ShowingInputSchema)],
        handler: create
    },
    {
        /** Retrieval of a specific showing by its MongoDB Object ID. */
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        /** Retrieval of a specific showing via its unique slug. */
        path: `/item/:slug/slug`,
        method: "get",
        middleware: [isAuth],
        handler: findBySlug
    },
    {
        /** Update of showtime details (e.g., status changes, price updates, or time shifts). */
        path: `/item/:_id`,
        method: "patch",
        middleware: [isAuth, validateZodSchema(ShowingInputSchema)],
        handler: update
    },
    {
        /** Cancellation/Removal of a scheduled showing. */
        path: `/item/:_id`,
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

/** Orchestrates the creation of the router using the generic CRUD utility factory. */
const router: Router = buildCRUDRoutes<ShowingSchemaFields>({
    model: Showing,
    routes: routes,
    populatePaths: ShowingPopulationPaths,
});

/** Advanced aggregation endpoint for complex scheduling lookups. */
router.get(
    "/query",
    authCRUDMiddleware,
    asyncHandler(
        aggregate({
            model: Showing,
            populationPipelines: ShowingPopulationPipelines,
            virtualsPipelines: ShowingSeatMapVirtualPipelines,
        })
    ),
);

export {
    router as ShowingCRUDRoutes,
};
