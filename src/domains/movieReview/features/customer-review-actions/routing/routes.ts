/**
 * @file Express router for administrative movie review moderation actions.
 * @filename routes.ts
 */

import {Router} from "express";
import isAuth from "@domains/authentication/middleware/isAuth";
import asyncHandler from "@shared/utility/handlers/asyncHandler";
import {
    patchResetDisplayName,
    patchResetLikes,
    patchSetRatings,
    patchToggleReviewPublicity
} from "@domains/movieReview/features/customer-review-actions/controllers";
import validateZodSchema from "@shared/utility/schema/validators/validateZodSchema";
import {AdminModerationMessageInputSchema} from "@shared/_feat/admin-users/schema";
import {
    ResetReviewDisplayNameInputSchema,
    SetReviewRatingInputSchema
} from "@domains/movieReview/features/customer-review-actions/validation";
import isAdmin from "@domains/authentication/middleware/isAdmin";

const router = Router();

/**
 * Administrative Moderation Routes
 * ---
 */

/** Toggle review visibility (Public/Private) */
router.patch(
    "/rev/:reviewID/publicity",
    [isAuth, isAdmin, validateZodSchema(AdminModerationMessageInputSchema)],
    asyncHandler(patchToggleReviewPublicity),
);

/** Correct or reset a reviewer's display name */
router.patch(
    "/rev/:reviewID/display-name",
    [isAuth, isAdmin, validateZodSchema(ResetReviewDisplayNameInputSchema)],
    asyncHandler(patchResetDisplayName),
);

/** Clear all 'helpful' engagement metrics from a review */
router.patch(
    "/rev/:reviewID/likes",
    [isAuth, isAdmin, validateZodSchema(AdminModerationMessageInputSchema)],
    asyncHandler(patchResetLikes),
);

/** Manually override the star rating for a review */
router.patch(
    "/rev/:reviewID/ratings",
    [isAuth, isAdmin, validateZodSchema(SetReviewRatingInputSchema)],
    asyncHandler(patchSetRatings),
);

export {
    router as CustomerMovieReviewActions,
};