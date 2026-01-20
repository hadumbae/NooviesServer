/**
 * @file MovieCredit.interface.ts
 *
 * TypeScript interface for MovieCredit documents.
 */

import {Types} from "mongoose";
import type {MovieSchemaFields} from "../../movie/model/Movie.types.js";
import type {PersonSchemaFields} from "../../person/interfaces/PersonSchemaFields.js";
import type IRoleType from "../../roleType/model/RoleType.interface.js";

/**
 * Represents a single credit for a person in a movie.
 *
 * Enforces CAST / CREW separation at the type level.
 */
export interface IMovieCredit {
    /** MongoDB ObjectId (readonly) */
    readonly _id: Types.ObjectId;

    /** URL-friendly identifier */
    slug: string;

    /** Movie reference */
    movie: Types.ObjectId | MovieSchemaFields;

    /** Person reference */
    person: Types.ObjectId | PersonSchemaFields;

    /** Credit department */
    department: "CAST" | "CREW";

    /** Role type definition */
    roleType: IRoleType;

    /** Optional display label for CREW roles */
    displayRoleName?: string;

    /** Optional notes */
    notes?: string;

    /** Optional credited name override */
    creditedAs?: string;

    // --- CAST ONLY ---

    /** Character name */
    characterName?: string;

    /** Billing order */
    billingOrder?: number;

    /** Primary role flag */
    isPrimary?: boolean;

    /** Uncredited appearance */
    uncredited?: boolean;

    /** Voice-only role */
    voiceOnly?: boolean;

    /** Cameo appearance */
    cameo?: boolean;

    /** Motion-capture role */
    motionCapture?: boolean;

    /** Archive footage role */
    archiveFootage?: boolean;
}
