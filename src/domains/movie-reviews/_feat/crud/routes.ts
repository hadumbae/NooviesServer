/**
 * @fileoverview Defines the Express router for movie review CRUD operations and aggregation queries.
 */

import type {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@/shared/_feat/generic-crud/routes";
import isAuth from "@/domains/authentication/middleware/isAuth";
import {buildAuthCRUDQueryMiddleware} from "@/shared/_feat/middleware";
import {destroy, find, findById, findBySlug, paginated} from "@/shared/_feat/generic-crud/path-handlers";
import {MovieReview, type MovieReviewSchemaFields} from "@/domains/movie-reviews/_models";
import {
    MovieReviewQueryMatchStageSchema,
    MovieReviewQuerySortStageSchema
} from "@/domains/movie-reviews/_feat/validate-query-options";

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

/** Router instance containing movie review CRUD and query endpoints. */
export {
    router as MovieReviewCRUDRoutes,
};