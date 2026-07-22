/**
 * @fileoverview Defines the Mongoose population paths for Showing documents.
 */

import type {PopulatePath} from "@/shared/_types/mongoose/PopulatePath";

/** Configuration for deep-populating movie, theatre, and screen references on a showing. */
export const ShowingPopulateRefs: PopulatePath[] = [
    {path: "movie", populate: {path: "genres"}},
    {path: "theatre"},
    {path: "screen"},
];
