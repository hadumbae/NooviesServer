/**
 * @fileoverview Express router for managing movie poster image uploads and removals.
 *
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import {
    ManageMoviePosterImageRouteConfigSchema
} from "@domains/movie/_feat/manage-image/ManageMoviePosterImageRouteConfigSchema";
import { validateRequestConfig } from "@shared/utility/schema/validators/validateRequestConfig";
import {uploadImage} from "@config/image-multr";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {hasPosterImage} from "@domains/movie/_feat/manage-image/hasPosterImage";
import {patchRemoveMoviePosterImage, patchUpdateMoviePosterImage} from "@domains/movie/_feat/manage-image/controller";

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