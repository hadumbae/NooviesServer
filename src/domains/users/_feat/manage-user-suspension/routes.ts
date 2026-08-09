/**
 * @fileoverview Express router configuring the middleware pipelines and patches for user suspension lifecycle routes.
 */

import {Router} from "express";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {isAuth, ManageUserRouteConfigSchema} from "@/domains/authentication";
import validateZodSchema from "@/shared/utility/schema/validators/validateZodSchema";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {UserSuspensionUpdateInputSchema} from "@/domains/users/_feat/manage-user-suspension/schema";
import {
    patchUpdateUserSuspension
} from "@/domains/users/_feat/manage-user-suspension/controller";

const router = Router();

router.patch(
    "/user/:userId/suspension/update",
    [
        isAuth,
        validateZodSchema(UserSuspensionUpdateInputSchema),
        validateRequestConfig({schema: ManageUserRouteConfigSchema}),
    ],
    asyncHandler(patchUpdateUserSuspension),
);

/** Express router instance containing user suspension administration endpoints. */
export {
    router as ManageUserSuspensionRoutes
}