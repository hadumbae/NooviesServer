/**
 * @file Type definitions for showing configuration.
 * @filename ShowingConfig.types.ts
 */

/**
 * Showing-level configuration flags affecting runtime behaviour.
 */
export interface ShowingConfigSchemaFields {
    /** Enables seat reservations. */
    canReserveSeats?: boolean | null;

    /** Marks special screenings (e.g. premieres). */
    isSpecialEvent?: boolean | null;

    /** Whether the showing is active and bookable. */
    isActive: boolean;
}