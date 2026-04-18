/**
 * @fileoverview Type definitions for the Person Details administrative view data.
 * Defines the configuration for fetching and the structure of the aggregated response.
 */

import type {PersonSchemaFields} from "@domains/person/model";
import type {PersonCreditStats, RoleCreditsGroup} from "@domains/movieCredit/_feat/person-credits";
import type {SlugString} from "@shared/schema/strings/SlugStringSchema";

/** Configuration for fetching the combined data required for the Person Details view. */
export type FetchPersonDetailsViewDataConfig = {
    slug: SlugString;
    limit?: number;
};

/** The aggregated data structure for the Person Details administrative view. */
export type FetchPersonDetailsViewData = {
    person: PersonSchemaFields;
    filmography: RoleCreditsGroup[];
    stats: PersonCreditStats;
};