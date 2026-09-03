/**
 * @fileoverview Population path configurations for querying theatre showings with related movie and screen summaries.
 */

import type {PopulatePath} from "@/shared/_types";
import {MovieSummarySelect} from "@/domains/movies/_feat/query-population";
import {ScreenSummarySelect} from "@/domains/screen/_feat/query-population";

/** Array of Mongoose populate path definitions for theatre showing relations. */
export const TheatreShowingPopulationPaths: PopulatePath[] = [
    {path: "movie", select: MovieSummarySelect, populate: {path: "genres"}},
    {path: "screen", select: ScreenSummarySelect},
];