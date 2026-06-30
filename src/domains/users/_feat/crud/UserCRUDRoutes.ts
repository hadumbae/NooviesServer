/**
 * @fileoverview Defines the CRUD express routes for user resource management.
 */

import type {Router} from "express";
import {buildCRUDRoutes, type CRUDRoute} from "@/shared/_feat/generic-crud/routes";
import isAuth from "@/domains/authentication/middleware/isAuth";
import {destroy, findById} from "@/shared/_feat/generic-crud/path-handlers";
import {User, type UserSchemaFields} from "@/domains/users/model/user";

const routes: CRUDRoute<UserSchemaFields>[] = [
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