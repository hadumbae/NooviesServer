/**
 * @fileoverview Express router configuring endpoints and middleware for managing user account status.
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {UserStatusUpdateInputSchema} from "@/domains/users/_feat/manage-user-status/schema";
import {ManageUserStatusRouteConfigSchema} from "@/domains/users/_feat/manage-user-status/route-config";
import {patchUpdateUserStatus} from "@/domains/users/_feat/manage-user-status/controller";

const router = Router();

router.patch(
    "/user/:userId/status/update",
    [
        isAuth,
        validateZodSchema(UserStatusUpdateInputSchema),
        validateRequestConfig({schema: ManageUserStatusRouteConfigSchema}),
    ],
    asyncHandler(patchUpdateUserStatus),
);

/** Express router handling route definitions for managing user status. */
export {
    router as ManageUserStatusRoutes
}