import {Router} from "express";
import {isAuth} from "@/domains/authentication/_middleware/isAuth";
import {isAdmin} from "@/domains/authentication/_middleware/isAdmin";
import {uploadImage} from "@/shared/config/image-multr";
import {hasProfileImage} from "@/domains/persons/_feat/update-image/hasProfileImage";
import asyncHandler from "@/shared/utility/handlers/asyncHandler";
import {deleteRemoveProfileImage, patchUpdateProfileImage} from "@/domains/persons/_feat/update-image/controller";

const router = Router();

router.patch(
    "/image/:_id/update",
    [isAuth, isAdmin, uploadImage.single("profileImage"), hasProfileImage],
    asyncHandler(patchUpdateProfileImage),
);

router.patch(
    "/image/:_id/remove",
    [isAuth, isAdmin],
    asyncHandler(deleteRemoveProfileImage),
);

export {
    router as PersonImageRoutes
}