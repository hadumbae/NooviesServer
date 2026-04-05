/**
 * @file Utility function to generate standardized unique tracking codes for movie reviews.
 * @filename generateMovieReviewUniqueCode.ts
 */

import {generateNanoID} from "@shared/utility/generateNanoID";

/**
 * Generates a formatted, unique identifier for a movie review.
 * ---
 * @returns {string} A unique code (e.g., "REV-7M2Q9-PL0X8").
 */
export function generateMovieReviewUniqueCode(): string {
    const nID = generateNanoID({length: 5});

    const codeString = `rev-${nID()}-${nID()}`;

    return codeString.toUpperCase();
}