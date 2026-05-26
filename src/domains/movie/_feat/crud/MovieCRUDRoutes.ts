/**
 * @fileoverview Express router configuration for the Movie domain.
 * Provides standard CRUD endpoints and specialized aggregation query interfaces
 * for managing the film catalog.
 */

import {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import isAuth from "@domains/authentication/middleware/isAuth";
import {buildAuthCRUDQueryMiddleware} from "@shared/_feat/middleware";
import {create, destroy, find, findById, findBySlug, paginated, update} from "@shared/_feat/generic-crud/path-handlers";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";
import type {MovieSchemaFields} from "@domains/movie/model/movie/Movie.types";
import {Movie} from "@domains/movie/model/movie/Movie.model";
import {MovieInputSchema} from "../validate-submit/MovieInputSchema";
import {MoviePopulationPaths} from "@domains/movie/_feat/query-population";
import {MovieQueryMatchStageSchema, MovieQuerySortStageSchema} from "@domains/movie/_feat/validate-query";

const modelName = Movie.modelName;
const matchSchema = MovieQueryMatchStageSchema;
const sortSchema = MovieQuerySortStageSchema;

/**
 * CRUD route definitions for the Movie entity.
 */
const routes: CRUDRoute<MovieSchemaFields>[] = [
    {
        /** Basic retrieval of movie records based on query filters (title, genre, etc.). */
        path: "/find",
        method: "get",
        middleware: buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
        handler: find
    },
    {
        /** Paginated retrieval optimized for administrative dashboards and catalog browsers. */
        path: "/paginated",
        method: "get",
        middleware: buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
        handler: paginated
    },
    {
        /** Creation of a new Movie record. */
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(MovieInputSchema)],
        handler: create
    },
    {
        /** Retrieval of a specific Movie by its MongoDB Object ID. */
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        /** Retrieval of a specific Movie by its SEO-friendly slug. */
        path: `/item/:slug/slug`,
        method: "get",
        middleware: [isAuth],
        handler: findBySlug
    },
    {
        /** Partial update of an existing Movie's metadata (e.g. availability, title, genres). */
        path: `/item/:_id`,
        method: "patch",
        middleware: [isAuth, validateZodSchema(MovieInputSchema)],
        handler: update
    },
    {
        /** Permanent deletion of a Movie record. */
        path: `/item/:_id`,
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

/**
 * Orchestrates the creation of the router using the generic CRUD utility factory.
 */
const router: Router = buildCRUDRoutes<MovieSchemaFields>({
    model: Movie,
    routes: routes,
    populatePaths: MoviePopulationPaths,
});

/**
 * Advanced aggregation endpoint for complex queries.
 */
router.get(
    "/query",
    buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
    asyncHandler(aggregate({model: Movie})),
);

export {
    router as MovieCRUDRoutes,
};