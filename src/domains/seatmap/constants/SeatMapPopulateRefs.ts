/**
 * @file SeatMapPopulateRefs.ts
 *
 * Default population configuration for the `SeatMap` Mongoose model.
 *
 * Centralizes all `.populate()` paths used when resolving seat map
 * relations, ensuring consistency across repositories, services,
 * and controllers.
 *
 * @remarks
 * - Prevents hard-coded population strings
 * - Keeps population logic synchronized with the schema
 * - Uses `as const` to preserve literal path types
 *
 * Populates:
 * - `showing`
 *   - `movie` (with `genres`)
 *   - `screen`
 *   - `theatre`
 * - `seat`
 *   - `screen`
 *   - `theatre`
 *
 * @example
 * ```ts
 * SeatMapModel.find()
 *   .populate(SeatMapPopulateRefs)
 *   .exec();
 * ```
 */

import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";

/**
 * Reusable population paths for the `SeatMap` model.
 */
const SeatMapPopulateRefs: PopulatePath[] = [
    {
        path: "showing",
        populate: [
            {path: "movie", populate: [{path: "genres"}]},
            {path: "screen"},
            {path: "theatre"},
        ],
    },
    {
        path: "seat",
        populate: [
            {path: "screen"},
            {path: "theatre"},
        ],
    },
] as const;

export default SeatMapPopulateRefs;
