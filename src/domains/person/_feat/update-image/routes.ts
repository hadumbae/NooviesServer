import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import {uploadImage} from "@config/image-multr";
import {hasProfileImage} from "@domains/person/_feat/update-image/hasProfileImage";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {deleteRemoveProfileImage, patchUpdateProfileImage} from "@domains/person/_feat/update-image/controller";

const router = Router();

router.patch(
    "/image/:_id/update",
    [isAuth, uploadImage.single("profileImage"), hasProfileImage],
    asyncHandler(patchUpdateProfileImage),
);

router.patch(
    "/image/:_id/remove",
    [isAuth],
    asyncHandler(deleteRemoveProfileImage),
);

export {
    router as PersonImageRoutes
}