import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {ShowingDetailsViewRouteConfigSchema} from "@domains/showing/_feat/admin-view-data";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {getFetchShowingDetailsViewData} from "@domains/showing/_feat/admin-view-data/controller";

const router = Router();

router.get(
    "/item/:slug/details",
    [isAuth, validateRequestConfig({schema: ShowingDetailsViewRouteConfigSchema})],
    asyncHandler(getFetchShowingDetailsViewData),
);

export {
    router as ShowingAdminViewDataRoutes
}