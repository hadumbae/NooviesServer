/**
 * @file fetchPopulatedShowing.ts
 *
 * Fetches a showing with all snapshot-relevant relations populated.
 *
 * @remarks
 * Intended for read-only workflows such as:
 * - snapshot creation
 * - reservation processing
 * - API response composition
 *
 * Uses `.lean()` to return a plain object and avoid
 * Mongoose document overhead.
 */

import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";
import Showing from "../model/showing/Showing.model.js";
import {Types} from "mongoose";
import type {PopulatedShowing} from "../model/showing/Showing.types.js";

/**
 * Retrieves a showing by ID with all required relations populated.
 *
 * @remarks
 * Populated paths:
 * - `theatre`
 * - `screen`
 * - `movie`, including its `genres`
 *
 * The returned object is fully resolved and suitable for
 * snapshot generation or downstream validation logic.
 *
 * @param _id ObjectId of the showing to retrieve
 * @returns Fully populated, lean showing object
 * @throws MongooseError If the showing does not exist
 */
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
        .populate(showingPopulation)
        .lean()
        .orFail() as Promise<PopulatedShowing>;
}
