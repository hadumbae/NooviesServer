/**
 * @file Concrete router implementation for the Genre domain using the Generic CRUD factory.
 * @filename GenreCRUDRoutes.ts
 */

import type {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/features/generic-crud/routes";
import Genre from "@domains/genre/models/genre/Genre.model";
import type {GenreSchemaFields} from "@domains/genre/models/genre/Genre.types";
import isAuth from "@domains/authentication/middleware/isAuth";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import {GenreInputSchema} from "@domains/genre/validation/GenreInputSchema";
import {create, destroy, find, findById, paginated, update} from "@shared/features/generic-crud/path-handlers";

/**
 * Route configuration for Genre management.
 * ---
 */
const routes: CRUDRoute<GenreSchemaFields>[] = [
    {path: "/find", method: "get", middleware: [isAuth], handler: find},
    {path: "/paginated", method: "get", middleware: [isAuth], handler: paginated},
    {path: `/item`, method: "post", middleware: [isAuth, validateZodSchema(GenreInputSchema)], handler: create},
    {path: `/item/:_id`, method: "get", middleware: [isAuth], handler: findById},
    {path: `/item/:_id`, method: "patch", middleware: [isAuth, validateZodSchema(GenreInputSchema)], handler: update},
    {path: `/item/:_id`, method: "delete", middleware: [isAuth], handler: destroy},
];

/**
 * The instantiated Express Router for Genre CRUD operations.
 * Generated via {@link buildCRUDRoutes} using the Genre model and defined routes.
 */
const router: Router = buildCRUDRoutes<GenreSchemaFields>({
    model: Genre,
    routes: routes,
    populatePaths: [] // Note: Added implicitly via factory if needed, currently empty for Genre.
});

export {
    router as GenreCRUDRoutes,
}