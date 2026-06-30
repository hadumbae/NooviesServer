/**
 * @fileoverview Type definitions for customer reservation fetch service parameters.
 */

/** Parameters for retrieving a reservation via its human-readable verification code. */
export type FetchReservationByCodeParams = {
    /**
     * The unique ticket identifier (e.g., "RES-A1B2C-D3E4F").
     */
    uniqueCode: string;
}