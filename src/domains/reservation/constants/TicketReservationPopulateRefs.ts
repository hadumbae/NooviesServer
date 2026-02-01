/**
 * @file TicketReservationPopulateRefs.ts
 *
 * Population paths for ticket reservation queries.
 *
 * Extends the standard showing population configuration
 * with reserved-seating specific relations.
 */

import type {PopulatePath} from "../../../shared/types/mongoose/PopulatePath.js";
import {ShowingPopulateRefs} from "../../showing/constants/ShowingPopulateRefs.js";

/**
 * Default populate configuration for ticket reservation documents.
 *
 * @remarks
 * - Includes all showing-related references
 * - Additionally populates selected seating and seat metadata
 * - Intended for read-oriented workflows such as:
 *   - Reservation review
 *   - Checkout confirmation
 *   - Administrative inspection
 */
export const TicketReservationPopulateRefs: PopulatePath[] = [
    ...ShowingPopulateRefs,
    {
        path: "selectedSeating",
        populate: {
            path: "seat",
        },
    },
];
