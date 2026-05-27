/**
 * @fileoverview Defines the default Mongoose populate configuration for Reservation documents.
 */

import type {PopulatePath} from "@shared/types/mongoose/PopulatePath";
import {ShowingPopulateRefs} from "@domains/showing/constants/ShowingPopulateRefs.js";

/** Default population paths for Reservation queries including nested showing and seating data. */
export const ReservationPopulatePaths: PopulatePath[] = [
    {
        path: "showing",
        populate: ShowingPopulateRefs as PopulatePath[],
    },
    {
        path: "selectedSeating",
        populate: {
            path: "seat",
        },
    },
];
