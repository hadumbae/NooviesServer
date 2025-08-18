import {z} from "zod";
import {Types} from "mongoose";
import {MovieCreditBaseSchema} from "./base/MovieCreditBaseSchema.js";

import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {IDInstance} from "../../../shared/schema/helpers/ZodInstanceHelpers.js";

const MovieCreditReadSchema = MovieCreditBaseSchema.extend({
    _id: z.instanceof(Types.ObjectId).readonly(),
    movie: IDInstance,
    person: IDInstance,
});

const CrewSchema = MovieCreditReadSchema.extend({
    roleType: z.literal("CREW"),
    job: RequiredStringSchema.max(150, "Job must be 150 characters or less."),
}).omit({characterName: true, billingOrder: true});

const CastSchema = MovieCreditReadSchema.extend({
    roleType: z.literal("CAST"),
    characterName: RequiredStringSchema.max(150, "Job must be 150 characters or less."),
    billingOrder: PositiveNumberSchema,
}).omit({job: true});

/**
 * A Zod schema representing a complete movie credit record.
 *
 * This schema validates both cast and crew credits using a discriminated union based on the `roleType` field.
 * It ensures that the appropriate fields are present depending on the role:
 *
 * - If `roleType` is `"CAST"`, the schema requires:
 *   - `characterName`: the character played (max 150 characters).
 *   - `billingOrder`: the actor's display or appearance order (max 150 characters).
 *
 * - If `roleType` is `"CREW"`, the schema requires:
 *   - `job`: the crew member’s role or title (e.g. "Director", "Producer").
 *
 * Additional fields include:
 * - `_id`: a read-only MongoDB ObjectId.
 * - `movie`: either an ObjectId or a full `Movie` document.
 * - `person`: either an ObjectId or a full `Person` document.
 * - Optional flags like `uncredited`, `cameo`, `voiceOnly`, etc.
 * - Optional `notes` field for additional context.
 */
export const MovieCreditSchema = z.discriminatedUnion("roleType", [CrewSchema, CastSchema]);

/**
 * TypeScript type inferred from the `MovieCreditSchema`.
 * Represents a validated movie credit for use in backend logic or API responses.
 */
export type ZMovieCredit = z.infer<typeof MovieCreditSchema>;