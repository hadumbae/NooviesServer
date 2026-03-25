/**
 * @file Utility for generating standardized, unique verification codes for reservations.
 * @filename generateReservationUniqueCode.ts
 */

import {generateNanoID} from "../../../../shared/utility/generateNanoID.js";

/**
 * Generates a human-readable, high-entropy unique identifier for reservation validation.
 * * **Format:** `RES-XXXXX-XXXXX` (e.g., `RES-K9P2W-LM4X1`).
 * @returns {string} A unique, uppercase alphanumeric code string.
 */
export function generateReservationUniqueCode(): string {
    const nID = generateNanoID({length: 5});
    const codeString = `res-${nID()}-${nID()}`;

    return codeString.toUpperCase();
}