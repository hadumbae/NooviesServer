import {Router} from "express";
import {isAuth} from "@/domains/authentication/_middleware/isAuth";
import {isAdmin} from "@/domains/authentication/_middleware/isAdmin";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {ShowingDetailsViewRouteConfigSchema} from "@/domains/showing/_feat/admin-view-data";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {getFetchShowingDetailsViewData} from "@/domains/showing/_feat/admin-view-data/controller";

const router = Router();

router.get(
    "/item/:slug/details",
    [isAuth, isAdmin, validateRequestConfig({schema: ShowingDetailsViewRouteConfigSchema})],
    asyncHandler(getFetchShowingDetailsViewData),
);

export {
    router as ShowingAdminViewDataRoutes
}