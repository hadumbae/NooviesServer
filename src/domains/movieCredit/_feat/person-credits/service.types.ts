/**
 * @fileoverview Type definitions for person filmography retrieval.
 */

import { Types } from "mongoose";
import type { IMovieCredit } from "@domains/movieCredit/models/MovieCredit.interface";
import type { RoleTypeDepartmentEnum } from "@domains/roleType/schemas/RoleTypeDepartment.enum";
import type IRoleType from "@domains/roleType/model/RoleType.interface";

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
    roleType: IRoleType;
    department: RoleTypeDepartmentEnum;
    totalCredits: number;
    topCredits: IMovieCredit[];
}