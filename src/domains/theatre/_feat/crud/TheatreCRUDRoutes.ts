/**
 * @fileoverview Express router configuration for the Theatre domain.
 * Provides standard CRUD endpoints and an aggregation query interface for cinema locations.
 */

import {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import isAuth from "@domains/authentication/middleware/isAuth";
import {parseQueryOptions} from "@shared/_feat/middleware";
import {create, destroy, find, findById, findBySlug, paginated, update} from "@shared/_feat/generic-crud/path-handlers";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";
import {TheatreQueryOptionSchema} from "@domains/theatre/_feat/validate-query";
import {TheatreInputSchema} from "@domains/theatre/schema/TheatreSchema";
import {Theatre, type TheatreSchemaFields} from "@domains/theatre/model/theatre";

/**
 * CRUD route definitions for the Theatre entity.
 */
const routes: CRUDRoute<TheatreSchemaFields>[] = [
    {
        /** Basic retrieval of theatres based on geographical or capacity filters. */
        path: "/find",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: TheatreQueryOptionSchema, modelName: Theatre.modelName})
        ],
        handler: find
    },
    {
        /** Paginated retrieval for the Theatre Management administrative table. */
        path: "/paginated",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: TheatreQueryOptionSchema, modelName: Theatre.modelName})
        ],
        handler: paginated
    },
    {
        /** Registration of a new theatre location. */
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(TheatreInputSchema)],
        handler: create
    },
    {
        /** Retrieval of a specific theatre by its MongoDB Object ID. */
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        /** Retrieval of a specific theatre via its SEO-friendly slug (e.g., /theatre/amc-empire-25/slug). */
        path: `/item/:slug/slug`,
        method: "get",
        middleware: [isAuth],
        handler: findBySlug
    },
    {
        /** Partial update of theatre details (e.g., updating seating capacity or address). */
        path: `/item/:_id`,
        method: "patch",
        middleware: [isAuth, validateZodSchema(TheatreInputSchema)],
        handler: update
    },
    {
        /** Permanent removal of a theatre record from the database. */
        path: `/item/:_id`,
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

/**
 * Orchestrates the creation of the router using a generic CRUD factory.
 */
const router: Router = buildCRUDRoutes<TheatreSchemaFields>({
    model: Theatre,
    routes: routes,
});

/**
 * Advanced aggregation endpoint for complex reports or cross-entity data fetching.
 */
router.get(
    "/query",
    [isAuth, parseQueryOptions({schema: TheatreQueryOptionSchema, modelName: Theatre.modelName})],
    asyncHandler(aggregate({model: Theatre})),
);

export {
    router as TheatreCRUDRoutes,
};