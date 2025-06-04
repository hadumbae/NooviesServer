import {z} from "zod";
import transformZodParsedJSON from "../../../../shared/utility/zod/transformZodParsedJSON.js";
import {RoleTypeEnumSchema} from "../enums/RoleTypeEnumSchema.js";
import {URLParamBooleanSchema} from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import {URLParamNumberSchema} from "../../../../shared/schema/url/URLParamNumberSchema.js";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";

/**
 * Schema for validating query parameters used when matching movie credits.
 *
 * This is used to filter or search for credits related to a movie and/or person,
 * with optional role, job, or character-related details.
 *
 * All fields are optional and are typically passed as URL query parameters.
 *
 * ## Fields:
 * - `movie`: MongoDB ObjectId of the movie. Optional.
 * - `person`: MongoDB ObjectId of the person. Optional.
 * - `roleType`: Enum string (e.g., "cast", "crew") parsed from a JSON-encoded string.
 * - `job`: Crew job name, trimmed and normalized string. Optional.
 * - `characterName`: Character name played, trimmed and normalized string. Optional.
 * - `billingOrder`: Numeric billing order (e.g., cast order). Optional.
 * - `uncredited`: Boolean flag if the person is uncredited. Optional.
 * - `voiceOnly`: Boolean flag if the performance is voice-only. Optional.
 * - `cameo`: Boolean flag if the role is a cameo. Optional.
 * - `motionCapture`: Boolean flag if motion capture was used. Optional.
 */
export const MovieCreditMatchQueryParamsSchema = z.object({
    /** MongoDB ObjectId of the movie (from query param). */
    movie: URLParamObjectIDSchema,

    /** MongoDB ObjectId of the person (from query param). */
    person: URLParamObjectIDSchema,

    /** Role type enum parsed from a JSON string (e.g., `"\"cast\""`). */
    roleType: z
        .string({ invalid_type_error: "Must be a valid URL string." })
        .optional()
        .transform(transformZodParsedJSON(RoleTypeEnumSchema)),

    /** Crew job title (e.g., "director"), trimmed string or undefined. */
    job: URLParamStringSchema,

    /** Character name (for cast), trimmed string or undefined. */
    characterName: URLParamStringSchema,

    /** Billing order number for cast listing. */
    billingOrder: URLParamNumberSchema,

    /** Whether the person is uncredited. */
    uncredited: URLParamBooleanSchema,

    /** Whether the role was voice-only. */
    voiceOnly: URLParamBooleanSchema,

    /** Whether the role was a cameo. */
    cameo: URLParamBooleanSchema,

    /** Whether the role involved motion capture. */
    motionCapture: URLParamBooleanSchema,
});

/** Type inferred from {@link MovieCreditMatchQueryParamsSchema}. */
export type MovieCreditMatchQueryParams = z.infer<typeof MovieCreditMatchQueryParamsSchema>;