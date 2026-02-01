/**
 * @file ShowingPopulateRefs.ts
 *
 * Standard population paths for showing queries.
 *
 * Defines the canonical set of Mongoose populate instructions
 * required to fully resolve a showing for read-oriented
 * workflows such as:
 * - API response composition
 * - Snapshot creation
 * - Reservation processing
 */

import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";

/**
 * Default populate configuration for showing documents.
 *
 * @remarks
 * Ensures that all commonly required relational data
 * is eagerly loaded in a consistent manner.
 */
export const ShowingPopulateRefs: PopulatePath[] = [
    {path: "movie", populate: {path: "genres"}},
    {path: "theatre"},
    {path: "screen"},
];
