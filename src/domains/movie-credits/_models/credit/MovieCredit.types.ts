/**
 * @fileoverview Defines the TypeScript interfaces for movie credit documents and their populated variants.
 *
 */

import {Types} from "mongoose";
import type {MovieSchemaFields} from "@/domains/movies";
import type {RoleTypeSchemaFields} from "@/domains/role-types";
import type {PersonSchemaFields} from "@/domains/persons";

/** Represents a single credit for a person in a movie, enforcing cast and crew separation. */
export type MovieCreditSchemaFields = {
    readonly _id: Types.ObjectId;
    slug: string;
    movie: Types.ObjectId;
    person: Types.ObjectId;
    department: "CAST" | "CREW";
    roleType: RoleTypeSchemaFields;
    displayRoleName?: string;
    notes?: string;
    creditedAs?: string;

    characterName?: string;
    billingOrder?: number;
    isPrimary?: boolean;
    uncredited?: boolean;
    voiceOnly?: boolean;
    cameo?: boolean;
    motionCapture?: boolean;
    archiveFootage?: boolean;
}

/** Represents a movie credit with the movie and person fields fully populated. */
export type PopulatedMovieCreditSchemaFields = Omit<MovieCreditSchemaFields, "movie" | "person"> & {
    movie: MovieSchemaFields;
    person: PersonSchemaFields;
}
