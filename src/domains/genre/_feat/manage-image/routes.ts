/**
 * @fileoverview Express router for managing genre image updates and removals.
 */

import {Router} from "express";
import {patchRemoveGenreImage, patchUpdateGenreImage} from "@domains/genre/_feat/manage-image/controller";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {ManageGenreImageRouteConfigSchema} from "@domains/genre/_feat/manage-image/schema/ManageGenreImageRouteConfig";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {uploadImage} from "@config/image-multr";
import {hasGenreImage} from "@domains/genre/_feat/manage-image/middleware/hasGenreImage";

const router = Router();

router.patch(
    "/item/:_id/image/update",
    [
        isAuth,
        validateRequestConfig({schema: ManageGenreImageRouteConfigSchema}),
        uploadImage.single("image"),
        hasGenreImage,
    ],
    asyncHandler(patchUpdateGenreImage),
);

router.patch(
    "/item/:_id/image/remove",
    [
        isAuth,
        validateRequestConfig({schema: ManageGenreImageRouteConfigSchema}),
    ],
    asyncHandler(patchRemoveGenreImage),
)

/** Router instance for genre image management endpoints. */
export {
    router as GenreImageManagementRoutes
}