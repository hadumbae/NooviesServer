/**
 * @fileoverview
 * Defines MongoDB indexes for the `Showing` collection.
 *
 * These indexes optimize queries related to scheduling,
 * seat availability, and filtering by movie, theatre, and screen.
 */

import {ShowingSchema} from "./Showing.schema.js";

/**
 * Compound index for querying showings by movie and start time.
 *
 * @remarks
 * Commonly used to list upcoming showings of a specific movie.
 */
ShowingSchema.index({movie: 1, startTime: 1});

/**
 * Compound index for querying showings by theatre, screen, and start time.
 *
 * @remarks
 * Optimizes seat lookup and schedule display within a specific screen.
 */
ShowingSchema.index({theatre: 1, screen: 1, startTime: 1});

/**
 * Index for identifying ongoing showings based on time range.
 *
 * @remarks
 * Enables quick lookup of showings currently in progress.
 */
ShowingSchema.index({startTime: 1, endTime: 1});

/**
 * Compound index for filtering active or special event showings by start time.
 *
 * @remarks
 * Avoids duplicate index key errors while still supporting both filters.
 */
ShowingSchema.index({ startTime: 1, isActive: 1, isSpecialEvent: 1 });