import type { IMovieCredit } from "../../models/MovieCredit.interface.js";
import { Types } from "mongoose";
import type { PopulatePath } from "../../../../shared/types/mongoose/PopulatePath.js";

/**
 * Parameters required to fetch movie credits for a specific person.
 */
export type FetchGroupedMovieCreditsByPersonParams = {
    /** The unique MongoDB ObjectId of the person whose credits are being fetched. */
    personID: Types.ObjectId;
    /** Optional limit for the number of credits returned per role. Defaults to 10. */
    limit?: number;
}

/**
 * Represents movie credits grouped under a specific role type.
 */
export type MovieCreditsByRole = {
    /** The name of the role (e.g., "actor", "director"). */
    roleName: string;
    /** A list of movie credits corresponding to this role. */
    credits: IMovieCredit[];
}

/**
 * Service interface for fetching movie credits.
 */
export interface IMovieCreditService {
    /**
     * Fetches movie credits for a specific person, grouped by role type.
     * The number of credits per role can be limited using `params.limit`.
     *
     * @param params - Object containing the person's ID and optional limit per role.
     * @returns A Promise that resolves to an array of credits grouped by role.
     */
    fetchGroupedMovieCreditsByPerson(
        params: FetchGroupedMovieCreditsByPersonParams
    ): Promise<MovieCreditsByRole[]>
}

/**
 * Optional constructor parameters for a MovieCreditService implementation.
 */
export interface IMovieCreditServiceConstructor {
    /** Paths to populate when fetching movie credits (e.g., person, movie). */
    populatePaths?: PopulatePath[];
}
