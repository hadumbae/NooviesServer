/**
 * @fileoverview Utility for generating unique identifiers for movie reviews.
 */

import {generateNanoID} from "@/shared/utility/generateNanoID";

/** Generates a formatted, unique identifier for a movie review. */
export function generateMovieReviewUniqueCode(): string {
    const nID = generateNanoID({length: 5});

    const codeString = `rev-${nID()}-${nID()}`;

    return codeString.toUpperCase();
}