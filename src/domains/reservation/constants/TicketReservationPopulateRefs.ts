/**
 * @file TicketReservationPopulateRefs.ts
 *
 * Population paths for ticket reservation queries.
 *
 * Defines the default population graph used when fetching
 * reservation documents for read-oriented use cases.
 */

import type {PopulateOption, PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";
import {ShowingPopulateRefs} from "../../showing/constants/ShowingPopulateRefs.js";

/**
 * Default populate configuration for ticket reservation documents.
 *
 * @remarks
 * - Always populates the associated showing and its related references
 * - Populates selected seating and seat metadata when present
 * - For general admission reservations, `selectedSeating` may be null
 *   or empty and is safely ignored by Mongoose population
 * - Intended for read-heavy workflows such as:
 *   - Reservation review
 *   - Checkout confirmation
 *   - Administrative inspection
 */
export const TicketReservationPopulateRefs: PopulatePath[] = [
    {
        path: "showing",
        populate: ShowingPopulateRefs as PopulateOption[],
    },
    {
        path: "selectedSeating",
        populate: {
            path: "seat",
        },
    },
];
