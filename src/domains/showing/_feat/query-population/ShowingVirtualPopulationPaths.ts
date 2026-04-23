/**
 * @fileoverview Configuration for Mongoose virtual population paths related to Showing statistics.
 */

import type { PopulatePath } from "@shared/types/mongoose/PopulatePath";

/**
 * Population paths for Showing virtual fields.
 */
export const ShowingVirtualPopulationPaths: PopulatePath[] = [
    { path: "seatMapCount" },
    { path: "availableSeatsCount" },
    { path: "unavailableSeatsCount" },
    { path: "reservedSeatsCount" },
    { path: "soldSeatsCount" },
];