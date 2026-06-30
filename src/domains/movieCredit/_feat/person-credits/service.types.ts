/**
 * @fileoverview Type definitions for person filmography retrieval.
 */

import {Types} from "mongoose";
import type {IMovieCredit} from "@/domains/movieCredit/models/MovieCredit.interface";
import type {RoleTypeDepartment} from "@/domains/role-types/_validation/schema/RoleTypeDepartmentSchema";
import type {RoleTypeSchemaFields} from "@/domains/role-types/_models/RoleType.types";

/**
 * Configuration for fetching statistical credit data.
 */
export type FetchPersonCreditStatsConfig = {
    personID: Types.ObjectId;
};

/**
 * Aggregated summary of a person's career footprint.
 */
export type PersonCreditStats = {
    creditCount: number;
    movieCount: number;
};

/**
 * Configuration for fetching a person's filmography.
 */
export type FetchPersonFilmographyConfig = {
    personID: Types.ObjectId;
    limit?: number;
}

/**
 * Represents a group of credits categorized by a specific role.
 */
export type RoleCreditsGroup = {
    role: string;
    roleType: RoleTypeSchemaFields;
    department: RoleTypeDepartment;
    totalCredits: number;
    topCredits: IMovieCredit[];
}