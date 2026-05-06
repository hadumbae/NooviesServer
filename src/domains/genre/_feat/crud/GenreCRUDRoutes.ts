/**
 * @fileoverview Concrete router implementation for the Genre domain.
 * Combines standard Generic CRUD operations with a specialized aggregation
 * endpoint to support complex filtering, sorting, and pagination.
 */

import type {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import type {GenreSchemaFields} from "@domains/genre/models/genre/Genre.types";
import isAuth from "@domains/authentication/middleware/isAuth";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import {buildAuthCRUDQueryMiddleware} from "@shared/_feat/middleware";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";
import {Genre} from "@domains/genre/models/genre";
import {genreCreate, genreUpdate} from "@domains/genre/_feat/crud/index";
import {destroy, find, findById, findBySlug, paginated} from "@shared/_feat/generic-crud/path-handlers";
import {GenreInputSchema} from "@domains/genre/_feat/validate-submit";
import {GenreQueryMatchStageSchema, GenreQuerySortStageSchema} from "@domains/genre/_feat/validate-query";

const modelName = Genre.modelName;
const matchSchema = GenreQueryMatchStageSchema;
const sortSchema = GenreQuerySortStageSchema;

/**
 * Standard CRUD route definitions for the Genre domain.
 */
const routes: CRUDRoute<GenreSchemaFields>[] = [
    {
        path: "/find",
        method: "get",
        middleware: buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
        handler: find
    },
    {
        path: "/paginated",
        method: "get",
        middleware: buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
        handler: paginated
    },
    {
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(GenreInputSchema)],
        handler: genreCreate
    },
    {
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        path: `/item/:slug/slug`,
        method: "get",
        middleware: [isAuth],
        handler: findBySlug
    },
    {
        path: `/item/:_id`,
        method: "patch",
        middleware: [isAuth, validateZodSchema(GenreInputSchema)],
        handler: genreUpdate
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
    buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
    asyncHandler(aggregate({model: Genre})),
);

export {
    router as GenreCRUDRoutes,
};