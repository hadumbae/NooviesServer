/**
 * @fileoverview Defines population paths for the screen model in Mongoose queries.
 */

import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";

/** Array of population paths to resolve when querying theatre screens. */
export const ScreenPopulationPaths: PopulatePath[] = [
    "theatre",
];