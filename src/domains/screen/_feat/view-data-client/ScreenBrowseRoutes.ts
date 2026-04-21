import {Router} from "express";
import ScreenServiceProvider from "../../provider/ScreenServiceProvider";
import asyncHandler from "@shared/utility/handlers/asyncHandler";

const {controllers: {browseController}} = ScreenServiceProvider.register();

const router = Router();

router.get(
    "/showings-by-screen/theatre/:theatreID/date/:dateString",
    asyncHandler(browseController.fetchShowingsByScreens.bind(browseController)),
);

export {
    router as ScreenBrowseRoutes,
}
