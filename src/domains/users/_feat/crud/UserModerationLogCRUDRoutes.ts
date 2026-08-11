/**
 * @fileoverview Defines the CRUD express routes for user resource management.
 */

import type {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@/shared/_feat/generic-crud/routes";
import {isAuth} from "@/domains/authentication/middleware/isAuth";
import {destroy, find, paginated} from "@/shared/_feat/generic-crud/path-handlers";
import {
    UserModerationLogQueryMatchStageSchema,
    UserModerationLogQuerySortStageSchema
} from "@/domains/users/_feat/validate-query";
import {buildAuthCRUDQueryStageMiddleware} from "@/shared/_feat/middleware";
import {UserModerationLog, type UserModerationLogSchemaFields} from "@/domains/users/model/moderation-log";

const modelName = UserModerationLog.modelName;
const matchSchema = UserModerationLogQueryMatchStageSchema;
const sortSchema = UserModerationLogQuerySortStageSchema;

const queryMiddleware = buildAuthCRUDQueryStageMiddleware({modelName, matchSchema, sortSchema});

const routes: CRUDRoute<UserModerationLogSchemaFields>[] = [
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
        method: "delete",
        middleware: [isAuth],
        handler: destroy
    },
];

const router: Router = buildCRUDRoutes<UserModerationLogSchemaFields>({
    model: UserModerationLog,
    routes: routes,
});

/** Express router containing CRUD endpoints for the User model. */
export {
    router as UserModerationLogCRUDRoutes,
};