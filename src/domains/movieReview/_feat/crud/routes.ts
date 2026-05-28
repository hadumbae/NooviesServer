/**
 * @fileoverview Defines the Express router for movie review CRUD operations and aggregation queries.
 */

import type {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import isAuth from "@domains/authentication/middleware/isAuth";
import {buildAuthCRUDQueryMiddleware} from "@shared/_feat/middleware";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";
import {Genre} from "@domains/genre/models/genre";
import {findById, findBySlug, destroy} from "@shared/_feat/generic-crud/path-handlers";
import {MovieReview, type MovieReviewSchemaFields} from "@domains/movieReview/model";
import {
    MovieReviewQueryMatchStageSchema,
    MovieReviewQuerySortStageSchema
} from "@domains/movieReview/_feat/validate-query-options";

const modelName = MovieReview.modelName;
const matchSchema = MovieReviewQueryMatchStageSchema;
const sortSchema = MovieReviewQuerySortStageSchema;

const routes: CRUDRoute<MovieReviewSchemaFields>[] = [
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
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

const router: Router = buildCRUDRoutes<MovieReviewSchemaFields>({
    model: MovieReview,
    routes: routes,
});

router.get(
    "/query",
    buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
    asyncHandler(aggregate({model: Genre})),
);

/** Router instance containing movie review CRUD and query endpoints. */
export {
    router as MovieReviewCRUDRoutes,
};