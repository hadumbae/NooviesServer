/**
 * @fileoverview Configuration for Mongoose population paths related to the Showing entity.
 */

import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";

/**
 * Standard population paths for a Showing document.
 */
export const ShowingPopulationPaths: PopulatePath[] = [
    {path: "movie", populate: {path: "genres"}},
    {path: "theatre"},
    {path: "screen"},
];