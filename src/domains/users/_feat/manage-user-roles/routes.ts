/**
 * @fileoverview Express router configuring the middleware pipelines and patches for user role administration endpoints.
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {patchGrantUserAdminRole, patchRevokeUserAdminRole} from "@/domains/users/_feat/manage-user-roles/controller";
import {UserRoleUpdateInputSchema} from "@/domains/users/_feat/manage-user-roles/schema/UserRoleUpdateInputSchema";
import {
    ManageUserRolesRouteConfigSchema
} from "@/domains/users/_feat/manage-user-roles/route-config/ManageUserRolesRouteConfigSchema";

const router = Router();

router.patch(
    "/user/:userId/role/admin/grant",
    [
        isAuth,
        validateZodSchema(UserRoleUpdateInputSchema),
        validateRequestConfig({schema: ManageUserRolesRouteConfigSchema}),
    ],
    asyncHandler(patchGrantUserAdminRole),
);

router.patch(
    "/user/:userId/role/admin/revoke",
    [
        isAuth,
        validateZodSchema(UserRoleUpdateInputSchema),
        validateRequestConfig({schema: ManageUserRolesRouteConfigSchema}),
    ],
    asyncHandler(patchRevokeUserAdminRole),
);

/** Express router instance containing user role adjustment routes. */
export {
    router as ManageUserRolesRoutes
}