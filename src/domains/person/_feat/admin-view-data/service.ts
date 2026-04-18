/**
 * @fileoverview Service for aggregating data required for the Person Details
 * administrative view. Combines biographical data with filmography results.
 */

import type {
    FetchPersonDetailsViewData,
    FetchPersonDetailsViewDataConfig
} from "@domains/person/_feat/admin-view-data/service.types";
import {Person} from "@domains/person/model";
import {fetchPersonCreditStats, fetchPersonFilmography} from "@domains/movieCredit/_feat/person-credits";

/**
 * Orchestrates parallel data fetching for a comprehensive Person profile.
 */
export async function fetchPersonDetailsViewData(
    {slug, limit}: FetchPersonDetailsViewDataConfig
): Promise<FetchPersonDetailsViewData> {
    const person = await Person.findOne({slug}).orFail();
    const filmography = await fetchPersonFilmography({personID: person._id, limit});
    const stats = await fetchPersonCreditStats({personID: person._id});

    return {
        person,
        stats,
        filmography,
    };
}