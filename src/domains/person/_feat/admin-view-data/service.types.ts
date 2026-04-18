/**
 * @fileoverview Type definitions for the Person Details administrative view data.
 * Defines the configuration for fetching and the structure of the aggregated response.
 */

import {Types} from "mongoose";
import type {PersonSchemaFields} from "@domains/person/model";
import type {PersonCreditStats, RoleCreditsGroup} from "@domains/movieCredit/_feat/person-credits";

/** Configuration for fetching the combined data required for the Person Details view. */
export type FetchPersonDetailsViewDataConfig = {
    _id: Types.ObjectId;
    limit?: number;
};

/** The aggregated data structure for the Person Details administrative view. */
export type FetchPersonDetailsViewData = {
    person: PersonSchemaFields;
    filmography: RoleCreditsGroup[];
    stats: PersonCreditStats;
};