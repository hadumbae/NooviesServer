/**
 * @fileoverview Concrete router implementation for the Genre domain.
 * Combines standard Generic CRUD operations with a specialized aggregation
 * endpoint to support complex filtering, sorting, and pagination.
 */

import type {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import Genre from "@domains/genre/models/genre/Genre.model";
import type {GenreSchemaFields} from "@domains/genre/models/genre/Genre.types";
import isAuth from "@domains/authentication/middleware/isAuth";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import {GenreInputSchema} from "@domains/genre/validation/GenreInputSchema";
import {create, destroy, find, findById, paginated, update} from "@shared/_feat/generic-crud/path-handlers";
import {GenreQueryOptionsSchema} from "@domains/genre/validation/query/GenreQueryOptionsSchema";
import {parseQueryOptions} from "shared/_feat/middleware";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";

/**
 * Standard CRUD route definitions for the Genre domain.
 */
const routes: CRUDRoute<GenreSchemaFields>[] = [
    {
        path: "/find",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: GenreQueryOptionsSchema, modelName: Genre.modelName})
        ],
        handler: find
    },
    {
        path: "/paginated",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: GenreQueryOptionsSchema, modelName: Genre.modelName})
        ],
        handler: paginated
    },
    {
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(GenreInputSchema)],
        handler: create
    },
    {
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        path: `/item/:_id`,
        method: "patch",
        middleware: [isAuth, validateZodSchema(GenreInputSchema)],
        handler: update
    },
    {
        path: `/item/:_id`,
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

/**
 * The instantiated Express Router for Genre CRUD operations.
 */
const router: Router = buildCRUDRoutes<GenreSchemaFields>({
    model: Genre,
    routes: routes,
});

/**
 * Specialized Aggregation Endpoint.
 */
router.get(
    "/query",
    [isAuth, parseQueryOptions({schema: GenreQueryOptionsSchema, modelName: Genre.modelName})],
    asyncHandler(aggregate({model: Genre})),
);

export {
    router as GenreCRUDRoutes,
};