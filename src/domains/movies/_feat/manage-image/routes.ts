/**
 * @fileoverview Express router defining routes for updating and removing movie poster and banner images.
 */

import {Router} from "express";
import {uploadImage} from "@/shared/config/image-multr";
import {isAuth} from "@/domains/authentication/_middleware/isAuth";
import {isAdmin} from "@/domains/authentication/_middleware/isAdmin";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {
    patchRemoveMovieBannerImage,
    patchRemoveMoviePosterImage
} from "@/domains/movies/_feat/manage-image/remove-image";
import {validateRequestConfig} from "@/shared/utility/schema/validators/validateRequestConfig";
import {hasMovieImage, ManageMovieImageRouteConfigSchema} from "@/domains/movies/_feat/manage-image/config";
import {patchUpdateMovieBanner, patchUpdateMoviePoster} from "@/domains/movies/_feat/manage-image/update-image";

const router = Router();

router.patch(
    "/item/:_id/poster-image/update",
    [
        isAuth,
        isAdmin,
        validateRequestConfig({schema: ManageMovieImageRouteConfigSchema}),
        uploadImage.single("image"),
        hasMovieImage,
    ],
    asyncHandler(patchUpdateMoviePoster),
);

router.patch(
    "/item/:_id/banner-image/update",
    [
        isAuth,
        isAdmin,
        validateRequestConfig({schema: ManageMovieImageRouteConfigSchema}),
        uploadImage.single("image"),
        hasMovieImage,
    ],
    asyncHandler(patchUpdateMovieBanner),
);

router.patch(
    "/item/:_id/poster-image/remove",
    [
        isAuth,
        isAdmin,
        validateRequestConfig({schema: ManageMovieImageRouteConfigSchema}),
    ],
    asyncHandler(patchRemoveMoviePosterImage),
);

router.patch(
    "/item/:_id/banner-image/remove",
    [
        isAuth,
        isAdmin,
        validateRequestConfig({schema: ManageMovieImageRouteConfigSchema}),
    ],
    asyncHandler(patchRemoveMovieBannerImage),
);

/** Express router instance for movie image management HTTP endpoints. */
export {
    router as MovieImageManagementRoutes
}