/**
 * @file Type definitions for showing configuration.
 * @filename ShowingConfig.types.ts
 */

/**
 * Showing configuration fields.
 */
export interface ShowingConfigSchemaFields {
    /** Enables seat reservations. */
    canReserveSeats: boolean;

    /** Marks special screenings. */
    isSpecialEvent: boolean;

    /** Controls whether the showing is active. */
    isActive: boolean;
}