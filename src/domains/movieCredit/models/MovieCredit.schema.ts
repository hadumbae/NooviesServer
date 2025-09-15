import {Schema} from "mongoose";
import type {IMovieCredit} from "./MovieCredit.interface.js";
import RoleTypeDepartmentConstant from "../../roleType/constants/RoleTypeDepartmentConstant.js";

/**
 * Shared schema definition for CAST-only boolean fields.
 *
 * ## Behavior
 * - Default:
 *   - For `CAST` credits → defaults to `false`.
 *   - For `CREW` credits → must be `undefined`.
 * - Validation:
 *   - Allowed only when `department === "CAST"`.
 *   - Automatically rejects values for `CREW` credits.
 */
const CastOnlyBoolean = {
    type: Boolean,
    default: function () {
        return (this as any).department === "CREW" ? undefined : false;
    },
    validate: {
        message: "Allowed for `CAST` credits only.",
        validator: function (value: boolean | undefined) {
            return (this as any).department === "CAST" || value === undefined;
        },
    },
};

/**
 * Mongoose schema for a Movie Credit.
 *
 * A `MovieCredit` represents how a **person** contributed to a **movie**,
 * either as **CAST** (an actor/performer) or **CREW** (a crew member).
 *
 * ## Key Rules
 * - `department` determines whether a record is CAST or CREW.
 * - Certain fields (e.g. `characterName`, `billingOrder`, boolean flags) are **CAST-only**.
 * - Other fields (e.g. `displayRoleName`) are **CREW-only**.
 * - Validation enforces that CAST-only fields are undefined for CREW and vice versa.
 *
 * ## Indexes & Uniqueness
 * - CAST credits enforce unique `billingOrder` per movie.
 * - CAST credits enforce uniqueness across `(movie, person, roleType, characterName)`.
 * - CREW credits enforce uniqueness across `(movie, person, roleType, displayRoleName)`.
 */
export const MovieCreditSchema = new Schema<IMovieCredit>({
    /**
     * Reference to the **Movie** this credit belongs to.
     */
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: [true, "Required."],
    },

    /**
     * Reference to the **Person** receiving this credit.
     */
    person: {
        type: Schema.Types.ObjectId,
        ref: "Person",
        required: [true, "Required."],
    },

    /**
     * Department of the credit.
     *
     * - Must be either `"CAST"` or `"CREW"`.
     * - Drives which fields are required or restricted.
     */
    department: {
        type: String,
        required: true,
        enum: RoleTypeDepartmentConstant,
    },

    /**
     * Reference to the **RoleType** describing this credit.
     *
     * Examples:
     * - CAST: "Actor"
     * - CREW: "Director", "Cinematographer"
     */
    roleType: {
        type: Schema.Types.ObjectId,
        ref: "RoleType",
        required: [true, "Required."],
    },

    /**
     * Display label for the role (CREW only).
     * - e.g. `"Director of Photography"`.
     * - Optional, trimmed, 1–150 chars.
     */
    displayRoleName: {
        type: String,
        trim: true,
        minlength: [1, "Must not be an empty string."],
        maxlength: [150, "Must be 150 characters or less."],
    },

    /**
     * Free-text notes about the credit.
     * - Optional, trimmed, 1–1000 chars.
     */
    notes: {
        type: String,
        trim: true,
        minlength: [1, "Must not be an empty string."],
        maxlength: [1000, "Must be 1000 characters or less."],
    },

    /**
     * Custom name shown in the credits (overrides Person’s name).
     * - e.g. `"J.D. Smith"` instead of `"John Smith"`.
     * - Optional, trimmed, 1–150 chars.
     */
    creditedAs: {
        type: String,
        trim: true,
        minlength: [1, "Must not be an empty string."],
        maxlength: [150, "Must be 150 characters or less."],
    },

    // --- CAST-specific fields ---

    /**
     * Character name (CAST only).
     *
     * Validation rules:
     * - Required for CAST credits.
     * - Must be undefined for CREW credits.
     */
    characterName: {
        type: String,
        minlength: [1, "Must not be an empty string."],
        maxlength: [150, "Must be 150 characters or less."],
        validate: {
            message: function ({value}: { value: string | undefined }) {
                const doc = (this as any);
                if (doc.department === "CREW" && value !== undefined) return "Must be undefined for `CREW` credits.";
                if (doc.department === "CAST" && value === undefined) return "Required for `CAST` credits.";
                return "Invalid values. Check `department` and other values.";
            },
            validator: function (value: string | undefined) {
                if (this.department === "CREW" && value === undefined) return true;
                return this.department === "CAST" && value !== undefined;
            },
        }
    },

    /**
     * Billing order (CAST only).
     *
     * Determines display order in cast list.
     * - Must be ≥ 1.
     * - Required for CAST, must be undefined for CREW.
     * - Unique per movie (see indexes).
     */
    billingOrder: {
        type: Number,
        min: [1, "Must be 1 or more."],
        validate: {
            validator: function (value: number | undefined) {
                if (this.department === "CREW") return value === undefined;
                return this.department === "CAST";
            },
            message: function ({value}: { value: number | undefined }) {
                const doc = (this as any);
                if (doc.department === "CREW" && value !== undefined) return "Must be undefined for `CREW` credits.";
                if (doc.department !== "CAST") return "Invalid values. Check `department` and other values.";
            }
        },
    },

    // --- CAST-only boolean flags ---

    /** Indicates an **uncredited** performance (CAST only). */
    uncredited: CastOnlyBoolean,

    /** Marks this as the **primary role** for the person (CAST only). */
    isPrimary: CastOnlyBoolean,

    /** Role is **voice-only** (CAST only). */
    voiceOnly: CastOnlyBoolean,

    /** Indicates a **cameo appearance** (CAST only). */
    cameo: CastOnlyBoolean,

    /** Role uses **motion capture** technology (CAST only). */
    motionCapture: CastOnlyBoolean,

    /** Role is from **archive footage** (CAST only). */
    archiveFootage: CastOnlyBoolean,
}, {timestamps: true});

/**
 * Indexes
 */

/** Index for filtering credits by movie and department (CAST/CREW). */
MovieCreditSchema.index({movie: 1, department: 1});

/** Ensures unique `billingOrder` per movie (CAST only). */
MovieCreditSchema.index(
    {movie: 1, billingOrder: 1},
    {unique: true, partialFilterExpression: {department: "CAST"}},
);

/** Ensures unique CAST credit per `(movie, person, roleType, characterName)`. */
MovieCreditSchema.index(
    {movie: 1, person: 1, roleType: 1, characterName: 1},
    {unique: true, partialFilterExpression: {department: "CAST"}},
);

/** Ensures unique CREW credit per `(movie, person, roleType, displayRoleName)`. */
MovieCreditSchema.index(
    {movie: 1, person: 1, roleType: 1, displayRoleName: 1},
    {unique: true, partialFilterExpression: {department: "CREW"}},
);
