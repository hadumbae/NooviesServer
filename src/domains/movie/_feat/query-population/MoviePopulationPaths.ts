/**
 * @fileoverview Defines the Mongoose population paths for Movie documents.
 */

import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";

/**
 * Configuration array specifying which related fields to populate in movie queries.
 */
export const MoviePopulationPaths: PopulatePath[] = [
    {path: "genres"},
];