/**
 * @fileoverview Express router defining endpoints for user registration, authentication, and administrative status management.
 */

import {Router} from "express";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import validateZodSchemaAsync from "@/shared/utility/schema/validators/validateZodSchemaAsync";
import {isAuth} from "@/domains/authentication/middleware/isAuth";
import {parseRouteParams} from "@/shared/_feat/middleware";
import {ManageUserRouteConfigSchema} from "@/domains/authentication/_feat/manage-users/routeSchema";
import {UserRegisterInputSchema} from "@/domains/authentication/_feat/register-user";
import {UserLoginInputSchema} from "@/domains/authentication/_feat/login-user";
import {UserPasswordUpdateInputSchema} from "@/domains/authentication/_feat/change-user-password";
import {
    getVerifyAdminStatus,
    postGrantAdminStatus,
    postLoginUser,
    postLogoutUser,
    postRegisterUser,
    postRevokeAdminStatus
} from "@/domains/authentication/_feat/manage-users/controller";

const router = Router();

router.post(
    "/register",
    validateZodSchema(UserRegisterInputSchema),
    asyncHandler(postRegisterUser),
);

router.post(
    "/login",
    validateZodSchemaAsync(UserLoginInputSchema),
    asyncHandler(postLoginUser),
);

router.post(
    "/logout",
    asyncHandler(postLogoutUser),
);

router.post(
    "/password/:userID/update",
    [isAuth, parseRouteParams({schema: ManageUserRouteConfigSchema}), validateZodSchema(UserPasswordUpdateInputSchema)],
    asyncHandler(postLogoutUser),
);

router.get(
    "/status/admin",
    isAuth,
    asyncHandler(getVerifyAdminStatus),
);

router.post(
    "/status/admin/:userId/grant",
    [isAuth, parseRouteParams({schema: ManageUserRouteConfigSchema})],
    asyncHandler(postGrantAdminStatus),
);

router.post(
    "/status/admin/:userId/revoke",
    [isAuth, parseRouteParams({schema: ManageUserRouteConfigSchema})],
    asyncHandler(postRevokeAdminStatus),
);

/** Express router instance containing authentication and user management routes. */
export {
    router as ManageUsersRoutes,
};