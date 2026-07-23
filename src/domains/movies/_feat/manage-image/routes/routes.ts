/**
 * @fileoverview Express router for managing movie poster image uploads and removals.
 *
 */

import {Router} from "express";
import {isAuth} from "@/domains/authentication/middleware/isAuth";
import {
    ManageMoviePosterImageRouteConfigSchema
} from "@/domains/movies/_feat/manage-image/schema/ManageMoviePosterImageRouteConfigSchema";
import { validateRequestConfig } from "@/shared/utility/schema/validators/validateRequestConfig";
import {uploadImage} from "@/shared/config/image-multr";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {hasPosterImage} from "@/domains/movies/_feat/manage-image/hooks/hasPosterImage";
import {patchRemoveMoviePosterImage, patchUpdateMoviePosterImage} from "@/domains/movies/_feat/manage-image/controller/controller";

const router = Router();

router.patch(
    "/item/:_id/poster-image/update",
    [
        isAuth,
        validateRequestConfig({schema: ManageMoviePosterImageRouteConfigSchema}),
        uploadImage.single("posterImage"),
        hasPosterImage,
    ],
    asyncHandler(patchUpdateMoviePosterImage),
);

router.patch(
    "/item/:_id/poster-image/remove",
    [
        isAuth,
        validateRequestConfig({schema: ManageMoviePosterImageRouteConfigSchema}),
    ],
    asyncHandler(patchRemoveMoviePosterImage),
);

/** Express router defining endpoints for movie poster image management. */
export {
  router as MovieImageManagementRoutes
}