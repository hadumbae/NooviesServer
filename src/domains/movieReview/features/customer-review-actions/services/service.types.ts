// src/domains/movieReview/features/customer-review-actions/services/service.types.ts

// Toggle Publicity

import {Types} from "mongoose";
import type {AdminModerationMessage} from "@shared/features/admin-users/schema";

export type ToggleReviewPublicityConfig = {
    adminID: Types.ObjectId;
    reviewID: Types.ObjectId;
    message: AdminModerationMessage;
}

// Reset Display Name

// Reset Likes

// Set Ratings