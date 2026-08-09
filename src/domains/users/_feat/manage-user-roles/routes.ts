/**
 * @fileoverview Express router configuring the middleware pipelines and patches for user role administration endpoints.
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {patchUpdateUserAdminRole} from "@/domains/users/_feat/manage-user-roles/controller";
import {UserAdminRoleUpdateInputSchema} from "@/domains/users/_feat/manage-user-roles/schema/UserAdminRoleUpdateInputSchema";
import {
    ManageUserRolesRouteConfigSchema
} from "@/domains/users/_feat/manage-user-roles/route-config/ManageUserRolesRouteConfigSchema";

const router = Router();

router.patch(
    "/user/:userId/role/admin/update",
    [
        isAuth,
        validateZodSchema(UserAdminRoleUpdateInputSchema),
        validateRequestConfig({schema: ManageUserRolesRouteConfigSchema}),
    ],
    asyncHandler(patchUpdateUserAdminRole),
);

/** Express router instance containing user role adjustment routes. */
export {
    router as ManageUserRolesRoutes
}