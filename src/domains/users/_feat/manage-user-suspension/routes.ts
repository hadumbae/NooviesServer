/**
 * @fileoverview Express router configuring the middleware pipelines and patches for user suspension lifecycle routes.
 */

import {Router} from "express";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {isAuth, ManageUserRouteConfigSchema} from "@/domains/authentication";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {UserSuspensionUpdateInputSchema} from "@/domains/users/_feat/manage-user-suspension/schema";
import {patchLiftUserSuspension, patchSuspendUser} from "@/domains/users/_feat/manage-user-suspension/controller";

const router = Router();

router.patch(
    "user/:userId/suspend",
    [
        isAuth,
        validateZodSchema(UserSuspensionUpdateInputSchema),
        validateRequestConfig({schema: ManageUserRouteConfigSchema}),
    ],
    asyncHandler(patchSuspendUser),
);

router.patch(
    "user/:userId/lift-suspension",
    [
        isAuth,
        validateZodSchema(UserSuspensionUpdateInputSchema),
        validateRequestConfig({schema: ManageUserRouteConfigSchema}),
    ],
    asyncHandler(patchLiftUserSuspension),
);

/** Express router instance containing user suspension administration endpoints. */
export {
    router as ManageUserSuspensionRoutes
}