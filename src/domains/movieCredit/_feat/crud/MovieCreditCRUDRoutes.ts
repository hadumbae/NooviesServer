/**
 * @fileoverview Express router configuration for the MovieCredit domain.
 * Provides standard CRUD endpoints and specialized aggregation query interfaces
 * for managing cast and crew relationships.
 */

import {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import isAuth from "@domains/authentication/middleware/isAuth";
import {parseQueryOptions} from "@shared/_feat/middleware";
import {create, destroy, find, findById, findBySlug, paginated, update} from "@shared/_feat/generic-crud/path-handlers";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";
import type {IMovieCredit} from "@domains/movieCredit/models/MovieCredit.interface";
import MovieCredit from "@domains/movieCredit/models/MovieCredit.model";
import {MovieCreditQueryOptionsSchema} from "@domains/movieCredit/_feat/validate-query";
import {MovieCreditInputSchema} from "@domains/movieCredit/schemas/MovieCreditInputSchema";

/**
 * CRUD route definitions for the MovieCredit entity.
 */
const routes: CRUDRoute<IMovieCredit>[] = [
    {
        /** Basic retrieval based on relational filters (e.g., all credits for a specific Movie ID). */
        path: "/find",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: MovieCreditQueryOptionsSchema, modelName: MovieCredit.modelName})
        ],
        handler: find
    },
    {
        /** Paginated retrieval optimized for cast/crew lists in admin panels or movie detail pages. */
        path: "/paginated",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: MovieCreditQueryOptionsSchema, modelName: MovieCredit.modelName})
        ],
        handler: paginated
    },
    {
        /** Assignment of a new credit (person to movie relationship). */
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(MovieCreditInputSchema)],
        handler: create
    },
    {
        /** Retrieval of a specific credit record by its MongoDB Object ID. */
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        /** Retrieval of a specific credit via its SEO-friendly slug. */
        path: `/item/:slug/slug`,
        method: "get",
        middleware: [isAuth],
        handler: findBySlug
    },
    {
        /** Partial update of credit metadata (e.g., changing billing order or character name). */
        path: `/item/:_id`,
        method: "patch",
        middleware: [isAuth, validateZodSchema(MovieCreditInputSchema)],
        handler: update
    },
    {
        /** Removal of a credit record from a movie. */
        path: `/item/:_id`,
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

/**
 * Orchestrates the creation of the router using the generic CRUD utility factory.
 */
const router: Router = buildCRUDRoutes<IMovieCredit>({
    model: MovieCredit,
    routes: routes,
});

/**
 * Advanced aggregation endpoint for complex credit reporting.
 */
router.get(
    "/query",
    [isAuth, parseQueryOptions({schema: MovieCreditQueryOptionsSchema, modelName: MovieCredit.modelName})],
    asyncHandler(aggregate({model: MovieCredit})),
);

export {
    router as MovieCreditCRUDRoutes,
};