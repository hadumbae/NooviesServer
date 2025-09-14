import {z} from "zod";

import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import {ObjectIdStringSchema} from "../../../shared/schema/strings/ObjectIdStringSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {CoercedBooleanSchema} from "../../../shared/schema/booleans/CoercedBooleanSchema.js";
import {RoleTypeDepartmentEnumSchema} from "../../roleType/schemas/RoleTypeDepartment.enum.js";

/**
 * Base schema for a movie credit input (common fields for both CAST and CREW)
 */
const MovieCreditBaseSchema = z.object({
    /** ID of the movie */
    movie: ObjectIdStringSchema,

    /** ID of the person */
    person: ObjectIdStringSchema,

    /** Department of the credit ("CAST" or "CREW") */
    department: RoleTypeDepartmentEnumSchema,

    /** Role type ID (e.g., Actor, Director) */
    roleType: ObjectIdStringSchema,

    /** Optional override for how the role name is displayed (max 150 chars) */
    displayRoleName: RequiredStringSchema
        .max(150, {message: "Must be 150 characters or less."})
        .optional(),

    /** Optional notes about this credit (max 1000 chars) */
    notes: RequiredStringSchema
        .max(1000, {message: "Must be 1000 characters or less."})
        .optional(),
});

const UndefinedForCrew = z.undefined({
    required_error: "Required as `undefined`.",
    invalid_type_error: "Must be `undefined`.",
    message: "Must be undefined for `CREW` credits."
}).optional();

/**
 * Schema for CREW credits
 */
const CrewSchema = MovieCreditBaseSchema.extend({
    /** Force department to "CREW" */
    department: z.literal("CREW"),
    characterName: UndefinedForCrew,
    billingOrder: UndefinedForCrew,
    creditedAs: UndefinedForCrew,
    uncredited: UndefinedForCrew,
    isPrimary: UndefinedForCrew,
    voiceOnly: UndefinedForCrew,
    cameo: UndefinedForCrew,
    motionCapture: UndefinedForCrew,
    archiveFootage: UndefinedForCrew,
});

/**
 * Schema for CAST credits
 */
const CastSchema = MovieCreditBaseSchema.extend({
    /** Force department to "CAST" */
    department: z.literal("CAST"),

    /** Name of the character (required for CAST, max 150 chars) */
    characterName: RequiredStringSchema.max(150, "Job must be 150 characters or less."),

    /** Billing order for CAST roles (positive number) */
    billingOrder: PositiveNumberSchema,

    /** Optional credited name if different from the person's name (max 150 chars) */
    creditedAs: RequiredStringSchema
        .max(150, {message: "Must be 150 characters or less."})
        .optional(),

    /** Optional: marks as uncredited */
    uncredited: CoercedBooleanSchema.optional(),

    /** Optional: marks as primary role */
    isPrimary: CoercedBooleanSchema.optional(),

    /** Optional: role is voice-only */
    voiceOnly: CoercedBooleanSchema.optional(),

    /** Optional: cameo appearance */
    cameo: CoercedBooleanSchema.optional(),

    /** Optional: motion capture role */
    motionCapture: CoercedBooleanSchema.optional(),

    /** Optional: archive footage */
    archiveFootage: CoercedBooleanSchema.optional(),
});

/**
 * Input schema for creating or updating a movie credit.
 * Uses a discriminated union on the `department` field:
 * - "CREW" uses `CrewSchema`
 * - "CAST" uses `CastSchema`
 */
export const MovieCreditInputSchema = z
    .discriminatedUnion("department", [CrewSchema, CastSchema])
    .describe("Movie Credit Input");