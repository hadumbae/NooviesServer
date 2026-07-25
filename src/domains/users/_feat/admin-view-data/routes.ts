/**
 * @fileoverview Express router for fetching administrative user view data.
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {UserDetailsViewRouteConfigSchema} from "@/domains/users/_feat/admin-view-data/user-details-view";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {getFetchUserDetailsViewData} from "@/domains/users/_feat/admin-view-data/controller";

const router = Router();

router.get(
    "/details/:userID",
    [isAuth, validateRequestConfig({schema: UserDetailsViewRouteConfigSchema})],
    asyncHandler(getFetchUserDetailsViewData),
);

/** Router containing administrative data endpoints for user views. */
export {
    router as UserAdminViewDataRoutes
}