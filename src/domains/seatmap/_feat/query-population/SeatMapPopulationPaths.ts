/**
 * @fileoverview Defines the Mongoose population paths for SeatMap documents.
 */

import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";

/** Configuration array for populating related showing, seat, and reservation data. */
export const SeatMapPopulationPaths: PopulatePath[] = [
    {path: "showing"},
    {path: "seat"},
    {path: "reservation"},
];