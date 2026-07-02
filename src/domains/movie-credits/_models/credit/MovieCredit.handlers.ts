/**
 * @fileoverview Error handlers for processing duplicate index violations in MovieCredit documents.
 */

import type {ZodIssue} from "zod";
import {ZodDuplicateIndexError} from "@/shared/errors/zod/ZodDuplicateIndexError";
import MovieCreditModel from "@/domains/movie-credits/_models/credit/MovieCredit.model";

/**
 * Maps database duplicate key errors to specific Zod validation issues for movie credits.
 */
export function handleDuplicateCreditIndex(indexString: string) {
    if (indexString === "movie_1_billingOrder_1") {
        const errors: ZodIssue[] = [
            {
                path: ["movie"],
                code: "custom",
                message: "This movie already has a cast member assigned to this billing order.",
            },
            {
                path: ["billingOrder"],
                code: "custom",
                message: "Billing order must be unique within a movie’s cast list.",
            },
        ];

        throw new ZodDuplicateIndexError({
            model: MovieCreditModel.modelName,
            index: indexString,
            errors,
            message: "Duplicate billing order detected. Each cast member in a movie must have a unique billing order.",
        });

    } else if (indexString === "movie_1_person_1_roleType_1_characterName_1") {
        const errors: ZodIssue[] = [
            {
                path: ["movie"],
                code: "custom",
                message: "This movie already includes this person in the cast.",
            },
            {
                path: ["person"],
                code: "custom",
                message: "This person is already credited with this character in the movie.",
            },
            {
                path: ["roleType"],
                code: "custom",
                message: "This person is already assigned to this role type for the movie.",
            },
            {
                path: ["characterName"],
                code: "custom",
                message: "This character is already associated with this actor in the movie.",
            },
        ];

        throw new ZodDuplicateIndexError({
            model: MovieCreditModel.modelName,
            index: indexString,
            errors,
            message: "Duplicate cast entry detected. A person cannot be credited with the same role and character more than once in a movie.",
        });

    } else if (indexString === "movie_1_person_1_roleType_1_displayRoleName_1") {
        const errors: ZodIssue[] = [
            {
                path: ["movie"],
                code: "custom",
                message: "This movie already includes this person in the crew.",
            },
            {
                path: ["person"],
                code: "custom",
                message: "This person is already credited in this role for the movie.",
            },
            {
                path: ["roleType"],
                code: "custom",
                message: "Role type already assigned to this person.",
            },
            {
                path: ["displayRoleName"],
                code: "custom",
                message: "Display role name already assigned.",
            },
        ];

        throw new ZodDuplicateIndexError({
            model: MovieCreditModel.modelName,
            index: indexString,
            errors,
            message: "Duplicate crew entry detected. A person cannot be credited with the same role and display role more than once in a movie.",
        });
    }
}
