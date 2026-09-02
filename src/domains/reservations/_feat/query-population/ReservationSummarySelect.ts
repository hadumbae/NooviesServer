/**
 * @fileoverview Selection string defining projected fields for ReservationSummary Mongoose queries.
 */

/** Projection string containing selectable fields for reservation summary projections. */
export const ReservationSummarySelect = [
    "ticketCount",
    "pricePaid",
    "currency",
    "isPaid",
    "snapshot",
    "_id",
    "slug",
    "uniqueCode",
    "reservationType",
    "status",
];