/**
 * @fileoverview Constant definitions for theatre screen layout grid classifications.
 */

/**
 * Defines the permissible layout classifications for a coordinate within a seating grid.
 * - **SEAT**: A functional unit available for reservation.
 * - **AISLE**: A walkway used to separate seating blocks.
 * - **STAIR**: A navigational element for vertical movement between rows.
 */
export const SeatLayoutTypeConstant = [
    "SEAT",
    "AISLE",
    "STAIR",
] as const;