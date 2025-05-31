import {MovieCreditBaseSchema} from "./base/MovieCreditBaseSchema.js";
import {z} from "zod";
import {ObjectIdStringSchema, RequiredStringSchema} from "../../../shared/schema/helpers/ZodStringHelpers.js";
import {PositiveNumber} from "../../../shared/schema/helpers/ZodNumberHelpers.js";

const MovieCreditWriteSchema = MovieCreditBaseSchema.extend({
    movie: ObjectIdStringSchema,
    person: ObjectIdStringSchema,
});

const CrewSchema = MovieCreditWriteSchema.extend({
    roleType: z.literal("CREW"),
    job: RequiredStringSchema.max(150, "Job must be 150 characters or less."),
}).omit({characterName: true, billingOrder: true});

const CastSchema = MovieCreditWriteSchema.extend({
    roleType: z.literal("CAST"),
    characterName: RequiredStringSchema.max(150, "Job must be 150 characters or less."),
    billingOrder: PositiveNumber,
}).omit({job: true});

/**
 * A Zod schema representing the structure of a movie credit submitted from the client.
 *
 * This schema uses a discriminated union based on the `roleType` field and ensures
 * that appropriate fields are required for each credit type:
 *
 * - If `roleType` is `"CAST"`:
 *   - `characterName`: the name of the character (max 150 characters).
 *   - `billingOrder`: a string representing order of appearance/prominence (max 150 characters).
 *
 * - If `roleType` is `"CREW"`:
 *   - `job`: the crew member’s role or department (e.g. "Director", "Composer") with a 150-character limit.
 *
 * Additional required fields include:
 * - `movie`: the ID of the associated movie (as a 24-character string).
 * - `person`: the ID of the associated person (as a 24-character string).
 *
 * Optional fields may include:
 * - `notes`, `uncredited`, `voiceOnly`, `cameo`, and `motionCapture`.
 *
 * This schema is suitable for validating form submissions or API inputs.
 */
export const MovieCreditSubmitSchema = z.discriminatedUnion("roleType", [CrewSchema, CastSchema]);

/**
 * TypeScript type inferred from `MovieCreditSubmitSchema`.
 * Represents a validated input for creating or updating a movie credit record.
 */
export type MovieCreditSubmit = z.infer<typeof MovieCreditSubmitSchema>;