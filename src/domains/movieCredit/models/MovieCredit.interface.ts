import { Types } from "mongoose";
import type {MovieSchemaFields} from "../../movie/model/Movie.types.js";
import type {PersonSchemaFields} from "../../person/interfaces/PersonSchemaFields.js";
import type IRoleType from "../../roleType/model/RoleType.interface.js";

/**
 * Represents a credit for a person in a movie, either as CAST or CREW.
 */
export interface IMovieCredit {
    /** MongoDB ObjectId (readonly) */
    readonly _id: Types.ObjectId;

    /** Reference to the movie (ObjectId or populated IMovie) */
    movie: Types.ObjectId | MovieSchemaFields;

    /** Reference to the person (ObjectId or populated IPerson) */
    person: Types.ObjectId | PersonSchemaFields;

    // --- RoleType ---

    /** Department of the credit: "CAST" or "CREW" */
    department: "CAST" | "CREW";

    /** Reference to the role type (e.g., Actor, Director, Producer) */
    roleType: IRoleType;

    /** Optional override for how the role name should be displayed */
    displayRoleName?: string;

    /** Optional notes about this credit */
    notes?: string;

    /** Optional name used in movie credits if different from person's name */
    creditedAs?: string;

    // --- Cast-specific fields ---

    /** Name of the character played (CAST only) */
    characterName?: string;

    /** Billing order for CAST roles; must be undefined for CREW */
    billingOrder?: number;

    // --- Boolean flags (CAST only) ---

    /** Marks this as the primary role */
    isPrimary?: boolean;

    /** Indicates an uncredited role */
    uncredited?: boolean;

    /** Role is voice-only */
    voiceOnly?: boolean;

    /** Indicates a cameo appearance */
    cameo?: boolean;

    /** Role uses motion capture */
    motionCapture?: boolean;

    /** Role is archive footage */
    archiveFootage?: boolean;
}