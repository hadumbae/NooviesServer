/**
 * @file ReservationPopulateRefs.ts
 *
 * Default populate configuration for Reservation queries.
 *
 * Responsibilities:
 * - Define relational hydration paths
 * - Centralize nested populate rules
 * - Ensure consistency across repositories and aggregates
 *
 * @remarks
 * Used by:
 * - BaseRepository
 * - AggregateQueryService
 * - Domain controllers
 *
 * Guarantees that:
 * - Showing is populated with its nested refs
 * - Selected seating resolves its seat reference
 */

import type { PopulateOption, PopulatePath } from "../../../shared/types/mongoose/PopulatePath.js";
import { ShowingPopulateRefs } from "../../showing/constants/ShowingPopulateRefs.js";

/**
 * Default Reservation populate definitions.
 */
export const ReservationPopulateRefs: PopulatePath[] = [
    {
        /**
         * Populate showing and its nested relations.
         */
        path: "showing",
        populate: ShowingPopulateRefs as PopulateOption[],
    },
    {
        /**
         * Populate selected seating and its seat reference.
         */
        path: "selectedSeating",
        populate: {
            path: "seat",
        },
    },
];
