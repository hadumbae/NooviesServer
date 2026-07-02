/**
 * @fileoverview Express router configuration for the MovieCredit domain.
 * Provides standard CRUD endpoints and specialized aggregation query interfaces
 * for managing cast and crew relationships.
 */

import {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@/shared/_feat/generic-crud/routes";
import isAuth from "@/domains/authentication/middleware/isAuth";
import {buildAuthCRUDQueryMiddleware} from "@/shared/_feat/middleware";
import {
    create,
    destroy,
    find,
    findById,
    findBySlug,
    paginated,
    update
} from "@/shared/_feat/generic-crud/path-handlers";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {aggregate} from "@/shared/_feat/generic-aggregate";
import type {MovieCreditSchemaFields} from "@/domains/movie-credits/_models/credit/MovieCredit.types";
import MovieCredit from "@/domains/movie-credits/_models/credit/MovieCredit.model";
import {
    MovieCreditQueryMatchStageSchema,
    MovieCreditQuerySortStageSchema
} from "@/domains/movie-credits/_feat/validate-query";
import {MovieCreditInputSchema} from "@/domains/movie-credits/_feat/validate-submit/schema/MovieCreditInputSchema";
import {MovieCreditPopulationPaths} from "@/domains/movie-credits/_feat/query-population";
import {MovieCreditPopulationPipelines} from "@/domains/movie-credits/_feat/aggregation";
import {handleDuplicateCreditIndex} from "@/domains/movie-credits/_models";

const modelName = MovieCredit.modelName;
const matchSchema = MovieCreditQueryMatchStageSchema;
const sortSchema = MovieCreditQuerySortStageSchema;

/**
 * CRUD route definitions for the MovieCredit entity.
 */
const routes: CRUDRoute<MovieCreditSchemaFields>[] = [
    {
        /** Basic retrieval based on relational filters (e.g., all credits for a specific Movie ID). */
        path: "/find",
        method: "get",
        middleware: buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
        handler: find
    },
    {
        /** Paginated retrieval optimized for cast/crew lists in admin panels or movie detail pages. */
        path: "/paginated",
        method: "get",
        middleware: buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
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
const router: Router = buildCRUDRoutes<MovieCreditSchemaFields>({
    model: MovieCredit,
    routes: routes,
    populatePaths: MovieCreditPopulationPaths,
    onDuplicateIndex: handleDuplicateCreditIndex,
});

/**
 * Advanced aggregation endpoint for complex credit reporting.
 */
router.get(
    "/query",
    buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
    asyncHandler(aggregate({model: MovieCredit, populationPipelines: MovieCreditPopulationPipelines})),
);

export {
    router as MovieCreditCRUDRoutes,
};