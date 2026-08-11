/**
 * @fileoverview Defines the Mongoose population configuration for movie review queries.
 */

import type {PopulatePath} from "@/shared/_types/mongoose/PopulatePath";
import {LeanUserQuerySelectFields} from "@/domains/users";

/** Population configuration for related MovieReview fields. */
export const MovieReviewPopulatePaths: PopulatePath[] = [
    {
        path: "movie",
        populate: {path: "genres"},
    },
    {
        path: "user",
        select: LeanUserQuerySelectFields
    }
];