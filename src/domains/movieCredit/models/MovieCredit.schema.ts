import {Schema} from "mongoose";
import type {IMovieCredit} from "./MovieCredit.interface.js";
import RoleTypeDepartmentConstant from "../../roleType/constants/RoleTypeDepartmentConstant.js";

/**
 * Validator to ensure boolean flags are only used for CAST credits.
 */
const notForCrewValidate = {
    validator: function (value: boolean | undefined) {
        return (this as any).department === "CAST" || value === undefined;
    },
    message: "Not allowed for `CREW` credits."
};

/**
 * Mongoose schema for a Movie Credit.
 * Represents a person’s involvement in a movie, either as CAST or CREW.
 */
export const MovieCreditSchema = new Schema<IMovieCredit>({
    /** Reference to the Movie this credit belongs to */
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: [true, "Required."],
    },

    /** Reference to the Person receiving this credit */
    person: {
        type: Schema.Types.ObjectId,
        ref: "Person",
        required: [true, "Required."],
    },

    /**
     * Department of the credit.
     * Should be either "CAST" or "CREW" (enum enforced).
     */
    department: {
        type: String,
        required: true,
        enum: RoleTypeDepartmentConstant,
    },

    /** Reference to the RoleType (e.g., Actor, Director, Producer) */
    roleType: {
        type: Schema.Types.ObjectId,
        ref: "RoleType",
        required: [true, "Required."],
    },

    /** Optional override for how the role name should be displayed */
    displayRoleName: {
        type: String,
        trim: true,
        maxlength: [150, "Must be 150 characters or less."],
    },

    /** Optional notes about this credit */
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, "Notes must be 1000 characters or less."],
    },

    /** Optional name used in movie credits if different from Person's name */
    creditedAs: {
        type: String,
        trim: true,
        maxlength: [150, "Must be 150 characters or less."],
    },

    // --- Cast-specific fields ---

    /**
     * Name of the character played (required for CAST)
     */
    characterName: {
        type: String,
        maxlength: [150, "Must be 150 characters or less."],
        required: function () {
            return this.department === "CAST";
        }
    },

    /**
     * Billing order for CAST credits.
     * Must be undefined for CREW. If provided for CAST, must be ≥ 1.
     */
    billingOrder: {
        type: Number,
        min: [1, "Must be 1 or more."],
        validate: {
            validator: function (value: number | undefined) {
                if (this.department === "CREW") return value === undefined;
                if (value === undefined) return true;
                return value >= 1;
            },
            message: "Must be undefined for `CREW`, but for `CAST`, 1 or more."
        }
    },

    // --- Boolean flags (CAST only) ---

    /** Indicates an uncredited role */
    uncredited: {
        type: Boolean,
        default: false,
    },

    /** Marks this as the primary role (CAST only) */
    isPrimary: {
        type: Boolean,
        default: false,
        validate: notForCrewValidate
    },

    /** Role is voice-only (CAST only) */
    voiceOnly: {
        type: Boolean,
        default: false,
        validate: notForCrewValidate
    },

    /** Indicates a cameo appearance (CAST only) */
    cameo: {
        type: Boolean,
        default: false,
        validate: notForCrewValidate
    },

    /** Role uses motion capture (CAST only) */
    motionCapture: {
        type: Boolean,
        default: false,
        validate: notForCrewValidate
    },

    /** Role is archive footage (CAST only) */
    archiveFootage: {
        type: Boolean,
        default: false,
        validate: notForCrewValidate
    },
}, {timestamps: true});

/**
 * Indexes
 */

/** Index for quick filtering by movie and department (CAST/CREW) */
MovieCreditSchema.index({movie: 1, department: 1});

/** Unique billing order per movie for CAST only */
MovieCreditSchema.index(
    {movie: 1, billingOrder: 1},
    {unique: true, partialFilterExpression: {department: "CAST"}},
);

/** Unique combination of movie, person, roleType, and characterName for CAST */
MovieCreditSchema.index(
    {movie: 1, person: 1, roleType: 1, characterName: 1},
    {unique: true, partialFilterExpression: {department: "CAST"}},
);

/** Unique combination of movie, person, roleType, and displayRoleName for CREW */
MovieCreditSchema.index(
    {movie: 1, person: 1, roleType: 1, displayRoleName: 1},
    {unique: true, partialFilterExpression: {department: "CREW"}},
);