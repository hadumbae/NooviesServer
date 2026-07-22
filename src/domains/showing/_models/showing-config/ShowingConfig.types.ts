/**
 * @fileoverview Defines the shape of configuration settings for a movie showing.
 */

/** Configuration fields for a showing including reservation and event status. */
export type ShowingConfigSchemaFields = {
    canReserveSeats?: boolean;
    isSpecialEvent?: boolean;
    isActive: boolean;
}