import {Router} from "express";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {getFetchShowingsByScreens} from "@/domains/screen/_feat/view-data-client/controller/controller";

const router = Router();

router.get(
    "/showings-by-screen/theatre/:theatreID/date/:dateString",
    asyncHandler(getFetchShowingsByScreens),
);

export {
    router as ScreenBrowseRoutes,
}
