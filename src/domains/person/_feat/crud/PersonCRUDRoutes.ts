import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import isAuth from "@domains/authentication/middleware/isAuth";
import {parseQueryOptions} from "@shared/_feat/middleware";
import {destroy, find, findById, findBySlug, paginated} from "@shared/_feat/generic-crud/path-handlers";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import {genreCreate, genreUpdate} from "@domains/genre/_feat/crud";
import type {Router} from "express";
import {Person, type PersonSchemaFields} from "@domains/person/model";
import {PersonQueryOptionsSchema} from "@domains/person/_feat/validate-query";
import {PersonInputSchema} from "@domains/person/_feat/validate-submit";

const routes: CRUDRoute<PersonSchemaFields>[] = [
    {
        path: "/find",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: PersonQueryOptionsSchema, modelName: Person.modelName})
        ],
        handler: find
    },
    {
        path: "/paginated",
        method: "get",
        middleware: [
            isAuth,
            parseQueryOptions({schema: PersonQueryOptionsSchema, modelName: Person.modelName})
        ],
        handler: paginated
    },
    {
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(PersonInputSchema)],
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
        middleware: [isAuth, validateZodSchema(PersonInputSchema)],
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
const router: Router = buildCRUDRoutes<PersonSchemaFields>({
    model: Person,
    routes: routes,
});

export {
    router as PersonCRUDRoutes,
};