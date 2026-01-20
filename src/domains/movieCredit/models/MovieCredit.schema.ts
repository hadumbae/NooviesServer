/**
 * @file MovieCredit.schema.ts
 *
 * Mongoose schema defining movie credits for cast and crew.
 */

import {Schema} from "mongoose";
import type {IMovieCredit} from "./MovieCredit.interface.js";
import RoleTypeDepartmentConstant from "../../roleType/constants/RoleTypeDepartmentConstant.js";
import SlugSchemaTypeOptions from "../../../shared/model/SlugSchemaTypeOptions.js";

/**
 * Shared schema definition for CAST-only boolean fields.
 *
 * @remarks
 * - CAST → defaults to `false`
 * - CREW → must be `undefined`
 * - Validation strictly enforces department rules
 */
const CastOnlyBoolean = {
    type: Boolean,
    default: function () {
        return (this as any).department === "CREW"
            ? undefined
            : false;
    },
    validate: {
        message: "Allowed for `CAST` credits only.",
        validator: function (value: boolean | undefined) {
            return (this as any).department === "CAST"
                || value === undefined;
        },
    },
};

/**
 * Schema representing a person’s contribution to a movie.
 *
 * A MovieCredit links:
 * - a **Movie**
 * - a **Person**
 * - a **RoleType**
 *
 * with strict CAST / CREW behavioral rules.
 */
export const MovieCreditSchema = new Schema<IMovieCredit>({
    /** Target movie for the credit */
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: [true, "Required."],
    },

    /** Person receiving the credit */
    person: {
        type: Schema.Types.ObjectId,
        ref: "Person",
        required: [true, "Required."],
    },

    /** URL-safe identifier derived from person name */
    slug: SlugSchemaTypeOptions,

    /**
     * Credit department.
     *
     * Controls field availability and validation.
     */
    department: {
        type: String,
        required: true,
        enum: RoleTypeDepartmentConstant,
    },

    /** Role type associated with this credit */
    roleType: {
        type: Schema.Types.ObjectId,
        ref: "RoleType",
        required: [true, "Required."],
    },

    /** Custom role label (CREW only) */
    displayRoleName: {
        type: String,
        trim: true,
        minlength: [1, "Must not be an empty string."],
        maxlength: [150, "Must be 150 characters or less."],
    },

    /** Optional free-text notes */
    notes: {
        type: String,
        trim: true,
        minlength: [1, "Must not be an empty string."],
        maxlength: [1000, "Must be 1000 characters or less."],
    },

    /** Override name shown in credits */
    creditedAs: {
        type: String,
        trim: true,
        minlength: [1, "Must not be an empty string."],
        maxlength: [150, "Must be 150 characters or less."],
    },

    // --- CAST ONLY ---

    /**
     * Character name.
     *
     * Required for CAST.
     * Forbidden for CREW.
     */
    characterName: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [150, "Must be 150 characters or less."],
        validate: {
            message: function ({value}: { value?: string }) {
                const doc = this as any;
                if (doc.department === "CREW" && value !== undefined)
                    return "Must be undefined for `CREW` credits.";
                if (doc.department === "CAST" && value === undefined)
                    return "Required for `CAST` credits.";
                return "Invalid value.";
            },
            validator: function (value?: string) {
                if (this.department === "CREW") return value === undefined;
                return this.department === "CAST" && value !== undefined;
            },
        },
    },

    /**
     * Billing order for CAST roles.
     */
    billingOrder: {
        type: Number,
        min: [1, "Must be 1 or more."],
        validate: {
            validator: function (value?: number) {
                if (this.department === "CREW") return value === undefined;
                return this.department === "CAST";
            },
            message: function ({value}: { value?: number }) {
                const doc = this as any;
                if (doc.department === "CREW" && value !== undefined)
                    return "Must be undefined for `CREW` credits.";
                return "Invalid value.";
            },
        },
    },

    // ─── CAST-only boolean flags ─────────────────────────────────────────

    /** Uncredited performance */
    uncredited: CastOnlyBoolean,

    /** Primary role indicator */
    isPrimary: CastOnlyBoolean,

    /** Voice-only role */
    voiceOnly: CastOnlyBoolean,

    /** Cameo appearance */
    cameo: CastOnlyBoolean,

    /** Motion-capture role */
    motionCapture: CastOnlyBoolean,

    /** Archive footage appearance */
    archiveFootage: CastOnlyBoolean,
}, {timestamps: true});

/**
 * Indexes
 */

/** Filter by movie and department */
MovieCreditSchema.index({movie: 1, department: 1});

/** Unique billing order per movie (CAST only) */
MovieCreditSchema.index(
    {movie: 1, billingOrder: 1},
    {unique: true, partialFilterExpression: {department: "CAST"}},
);

/** Unique CAST credit identity */
MovieCreditSchema.index(
    {movie: 1, person: 1, roleType: 1, characterName: 1},
    {unique: true, partialFilterExpression: {department: "CAST"}},
);

/** Unique CREW credit identity */
MovieCreditSchema.index(
    {movie: 1, person: 1, roleType: 1, displayRoleName: 1},
    {unique: true, partialFilterExpression: {department: "CREW"}},
);
