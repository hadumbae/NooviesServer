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
import {AdminModerationMessageInputSchema} from "@shared/features/admin-users/schema";
import {
    ResetReviewDisplayNameInputSchema,
    SetReviewRatingInputSchema
} from "@domains/movieReview/features/customer-review-actions/validation";

const router = Router();

/**
 * Administrative Moderation Routes
 * ---
 */

/** Toggle review visibility (Public/Private) */
router.patch(
    "/rev/:reviewID/publicity",
    [isAuth, validateZodSchema(AdminModerationMessageInputSchema)],
    asyncHandler(patchToggleReviewPublicity),
);

/** Correct or reset a reviewer's display name */
router.patch(
    "/rev/:reviewID/display-name",
    [isAuth, validateZodSchema(ResetReviewDisplayNameInputSchema)],
    asyncHandler(patchResetDisplayName),
);

/** Clear all 'helpful' engagement metrics from a review */
router.patch(
    "/rev/:reviewID/likes",
    [isAuth, validateZodSchema(AdminModerationMessageInputSchema)],
    asyncHandler(patchResetLikes),
);

/** Manually override the star rating for a review */
router.patch(
    "/rev/:reviewID/ratings",
    [isAuth, validateZodSchema(SetReviewRatingInputSchema)],
    asyncHandler(patchSetRatings),
);

export {
    router as CustomerMovieReviewActions,
};