/**
 * @fileoverview Defines the schema for route parameters containing a review ID for the current user.
 */

import { z } from "zod";
import {ObjectIdSchema} from "@/shared/schema/mongoose/ObjectIdSchema";

/** Zod schema for validating route configurations that require a reviewID. */
export const MyReviewIDRouteConfigSchema  = z.object({
    reviewID: ObjectIdSchema,
});

/** Type definition for route configurations containing a reviewID. */
export type MyReviewIDRouteConfig = z.infer<typeof MyReviewIDRouteConfigSchema>;