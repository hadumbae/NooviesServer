/**
 * @file Type definitions for administrative reservation fetch parameters.
 * @filename FetchService.types.ts
 */

/**
 * Parameters for retrieving a reservation via its human-readable verification code.
 */
export type FetchReservationByCodeParams = {
    /**
     * The unique ticket identifier (e.g., "RES-A1B2C-D3E4F").
     * @see {@link generateReservationUniqueCode} for the generation logic.
     */
    uniqueCode: string;
}