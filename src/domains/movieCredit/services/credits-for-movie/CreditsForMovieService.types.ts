/**
 * @file Shared types for grouped movie credit aggregation results.
 * @filename CreditsForMovieService.types.ts
 */

import type {IMovieCredit} from "../../models/MovieCredit.interface.js";
import type {RoleTypeCastCategory, RoleTypeCrewCategory} from "../../../roleType/schemas/RoleTypeCategory.types.js";

/**
 * Credits grouped under a shared role category.
 */
export type CategoryGroupedCredits = {
    /** Role classification shared by grouped credits */
    category: RoleTypeCastCategory | RoleTypeCrewCategory;

    /** Credits belonging to the category */
    credits: IMovieCredit[];

    /** Total number of credits in the category */
    totalCredits: number;
}

/**
 * Aggregated credit collections for a movie.
 */
export type GroupedCreditsForMovieData = {
    /** Cast credits ordered by billing priority */
    castCredits: IMovieCredit[];

    /** Crew credits grouped by role category */
    crewCredits: CategoryGroupedCredits[];
}