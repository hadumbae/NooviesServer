/**
 * @fileoverview Express router configuration for the RoleType domain.
 * Provides standard CRUD endpoints and specialized aggregation query interfaces
 * for managing organizational roles and departments.
 */

import {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@shared/_feat/generic-crud/routes";
import isAuth from "@domains/authentication/middleware/isAuth";
import {buildAuthCRUDQueryMiddleware} from "@shared/_feat/middleware";
import {create, destroy, find, findById, paginated, update} from "@shared/_feat/generic-crud/path-handlers";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {aggregate} from "@shared/_feat/generic-aggregate";
import type IRoleType from "@domains/roleType/model/RoleType.interface";
import RoleTypeModel from "@domains/roleType/model/RoleType.model";
import {RoleTypeQueryMatchStageSchema, RoleTypeQuerySortStageSchema} from "@domains/roleType/_feat/validate-query";
import {RoleTypeInputSchema} from "@domains/roleType/schemas/RoleTypeInput.schema";

const modelName = RoleTypeModel.modelName;
const matchSchema = RoleTypeQueryMatchStageSchema;
const sortSchema = RoleTypeQuerySortStageSchema;

/**
 * CRUD route definitions for the RoleType entity.
 */
const routes: CRUDRoute<IRoleType>[] = [
    {
        /** Basic retrieval of roles based on name or department. */
        path: "/find",
        method: "get",
        middleware: buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
        handler: find
    },
    {
        /** Paginated retrieval for administrative role-management tables. */
        path: "/paginated",
        method: "get",
        middleware: buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
        handler: paginated
    },
    {
        /** Definition of a new RoleType. */
        path: `/item`,
        method: "post",
        middleware: [isAuth, validateZodSchema(RoleTypeInputSchema)],
        handler: create
    },
    {
        /** Retrieval of a specific role by its MongoDB Object ID. */
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        /** Partial update of role attributes (e.g., changing the role name or department). */
        path: `/item/:_id`,
        method: "patch",
        middleware: [isAuth, validateZodSchema(RoleTypeInputSchema)],
        handler: update
    },
    {
        /** Permanent removal of a role definition. */
        path: `/item/:_id`,
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

/**
 * Orchestrates the creation of the router using the generic CRUD utility factory.
 */
const router: Router = buildCRUDRoutes<IRoleType>({
    model: RoleTypeModel,
    routes: routes,
});

/**
 * Advanced aggregation endpoint for complex organisational queries.
 */
router.get(
    "/query",
    buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema}),
    asyncHandler(aggregate({model: RoleTypeModel})),
);

export {
    router as RoleTypeCRUDRoutes,
};