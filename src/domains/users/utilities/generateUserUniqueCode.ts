/**
 * @file Utility for generating standardized, collision-resistant user identification codes.
 * @filename generateUserUniqueCode.ts
 */

import {generateNanoID} from "@shared/utility/generateNanoID";

/**
 * Generates a unique, alphanumeric identification string for user accounts.
 * @returns A validated unique code string conforming to the user identity schema.
 */
export function generateUserUniqueCode() {
    const nID = generateNanoID({length: 5});

    const codeString = `usr-${nID()}-${nID()}`;

    console.log(codeString);

    return codeString.toUpperCase();
}