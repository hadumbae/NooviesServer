/**
 * @fileoverview Express router for administrative movie review moderation actions.
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {
    patchResetDisplayName,
    patchResetLikes,
    patchSetRatings,
    patchToggleReviewPublicity
} from "@domains/movieReview/_feat/customer-review-actions/controllers";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import {AdminModerationMessageInputSchema} from "@shared/_feat/admin-users/schema";
import {
    ResetReviewDisplayNameInputSchema,
    SetReviewRatingInputSchema
} from "@domains/movieReview/_feat/customer-review-actions/validation";
import isAdmin from "@domains/authentication/middleware/isAdmin";
import {validateRequestConfig} from "@shared/utility/schema/validators/validateRequestConfig";
import {CustomerReviewIDRouteConfigSchema} from "@domains/movieReview/_feat/customer-review-actions/schema";

const router = Router();

/** Toggle review visibility (Public/Private) */
router.patch(
    "/rev/:reviewID/publicity",
    [
        isAuth,
        isAdmin,
        validateRequestConfig({schema: CustomerReviewIDRouteConfigSchema}),
        validateZodSchema(AdminModerationMessageInputSchema),
    ],
    asyncHandler(patchToggleReviewPublicity),
);

/** Correct or reset a reviewer's display name */
router.patch(
    "/rev/:reviewID/display-name",
    [
        isAuth,
        isAdmin,
        validateRequestConfig({schema: CustomerReviewIDRouteConfigSchema}),
        validateZodSchema(ResetReviewDisplayNameInputSchema),
    ],
    asyncHandler(patchResetDisplayName),
);

/** Clear all 'helpful' engagement metrics from a review */
router.patch(
    "/rev/:reviewID/likes",
    [
        isAuth,
        isAdmin,
        validateRequestConfig({schema: CustomerReviewIDRouteConfigSchema}),
        validateZodSchema(AdminModerationMessageInputSchema),
    ],
    asyncHandler(patchResetLikes),
);

/** Manually override the star rating for a review */
router.patch(
    "/rev/:reviewID/ratings",
    [
        isAuth,
        isAdmin,
        validateRequestConfig({schema: CustomerReviewIDRouteConfigSchema}),
        validateZodSchema(SetReviewRatingInputSchema),
    ],
    asyncHandler(patchSetRatings),
);

/** Router handling administrative moderation actions for customer movie reviews. */
export {
    router as CustomerMovieReviewActions,
};