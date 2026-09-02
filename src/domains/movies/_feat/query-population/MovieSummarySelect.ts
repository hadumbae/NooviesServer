/**
 * @fileoverview Selection string defining projected fields for MovieSummary Mongoose queries.
 */

/** Projection string containing selectable fields for movie summary projections. */
export const MovieSummarySelect = [
    "_id",
    "slug",
    "title",
    "tagline",
    "genres",
    "runtime",
    "posterImage",
    "releaseDate",
];