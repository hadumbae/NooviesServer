/**
 * @fileoverview Express router configuring the middleware pipelines and patches for user suspension lifecycle routes.
 */

import {Router} from "express";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";
import {isAuth, ManageUserRouteConfigSchema} from "@/domains/authentication";
import {patchLiftUserSuspension, patchSuspendUser, UserSuspensionUpdateInputSchema} from "@/domains/users";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";

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