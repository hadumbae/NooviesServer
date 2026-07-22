/**
 * @fileoverview Service function to retrieve a showing document with its related entities populated.
 */

import type {PopulatePath} from "@/shared/_types/mongoose/PopulatePath";
import {Showing} from "@/domains/showing/_models/showing/Showing.model.js";
import {Types} from "mongoose";
import type {PopulatedShowing} from "@/domains/showing/_models/showing/Showing.types.js";

/** Subset of PopulatedShowing used for Mongoose population typing. */
type SchemaPopulatePath = Pick<PopulatedShowing, "theatre" | "screen" | "movie">;

/** Fetches a single showing by ID and populates theatre, screen, and movie details. */
export async function fetchPopulatedShowing(
    _id: Types.ObjectId,
): Promise<PopulatedShowing> {
    const showingPopulation: PopulatePath[] = [
        {path: "theatre"},
        {path: "screen"},
        {path: "movie", populate: {path: "genres"}},
    ];

    return Showing
        .findById(_id)
        .populate<SchemaPopulatePath>(showingPopulation)
        .lean()
        .orFail();
}
