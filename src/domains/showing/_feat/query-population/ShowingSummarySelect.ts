/**
 * @fileoverview Selection string defining projected fields for ShowingSummary Mongoose queries.
 */

/** Projection string containing selectable fields for showing summary projections. */
export const ShowingSummarySelect = [
    "_id",
    "startTime",
    "endTime",
    "ticketPrice",
    "movie",
    "status",
    "theatreSnapshot",
    "config",
    "slug",
];