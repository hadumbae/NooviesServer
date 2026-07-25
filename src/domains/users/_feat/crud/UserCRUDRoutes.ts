/**
 * @fileoverview Defines the CRUD express routes for user resource management.
 */

import type {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@/shared/_feat/generic-crud/routes";
import {isAuth} from "@/domains/authentication/middleware/isAuth";
import {destroy, find, findById, paginated} from "@/shared/_feat/generic-crud/path-handlers";
import {User, type UserSchemaFields} from "@/domains/users/model/user";
import {UserQueryMatchStageSchema, UserQuerySortStageSchema} from "@/domains/users/_feat/validate-query";
import {buildAuthCRUDQueryMiddleware} from "@/shared/_feat/middleware";

const modelName = User.modelName;
const matchSchema = UserQueryMatchStageSchema;
const sortSchema = UserQuerySortStageSchema;

const queryMiddleware = buildAuthCRUDQueryMiddleware({modelName, matchSchema, sortSchema});

const routes: CRUDRoute<UserSchemaFields>[] = [
    {
        path: `/find`,
        method: "get",
        middleware: queryMiddleware,
        handler: find
    },
    {
        path: `/paginated`,
        method: "get",
        middleware: queryMiddleware,
        handler: paginated,
    },
    {
        path: `/item/:_id`,
        method: "get",
        middleware: [isAuth],
        handler: findById
    },
    {
        path: `/item/:_id`,
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

const router: Router = buildCRUDRoutes<UserSchemaFields>({
    model: User,
    routes: routes,
});

/** Express router containing CRUD endpoints for the User model. */
export {
    router as UserCRUDRoutes,
};