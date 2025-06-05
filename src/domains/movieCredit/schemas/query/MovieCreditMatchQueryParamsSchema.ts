import {z} from "zod";
import {RoleTypeEnumSchema} from "../enums/RoleTypeEnumSchema.js";
import {URLParamBooleanSchema} from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import {URLParamNumberSchema} from "../../../../shared/schema/url/URLParamNumberSchema.js";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";

/**
 * Schema for validating query parameters used when matching movie credits.
 * All fields are expected to come from URL parameters and are validated/coerced accordingly.
 */
export const MovieCreditMatchQueryParamsSchema = z.object({
    /**
     * The unique identifier of the movie credit. Optional.
     * Expected to be a valid ObjectId string if present.
     */
    _id: URLParamObjectIDSchema,

    /**
     * The unique identifier of the movie.
     * Expected to be a valid ObjectId string.
     */
    movie: URLParamObjectIDSchema,

    /**
     * The unique identifier of the person associated with the credit.
     * Expected to be a valid ObjectId string.
     */
    person: URLParamObjectIDSchema,

    /**
     * The type of role (e.g., CAST or CREW). Optional.
     * Must be one of the values defined in {@link RoleTypeEnumSchema}.
     */
    roleType: RoleTypeEnumSchema.optional(),

    /**
     * The job title for crew members (e.g., "Producer", "Director"). Optional.
     * If provided, must be a non-empty trimmed string.
     */
    job: URLParamStringSchema,

    /**
     * The name of the character portrayed (for cast roles). Optional.
     * If provided, must be a non-empty trimmed string.
     */
    characterName: URLParamStringSchema,

    /**
     * The billing order of the credit (e.g., for cast listings). Optional.
     * Expected to be a numeric value if present.
     */
    billingOrder: URLParamNumberSchema,

    /**
     * Whether the credit is uncredited (i.e., not shown in the final movie credits). Optional.
     * Expected to be a boolean value (true/false).
     */
    uncredited: URLParamBooleanSchema,

    /**
     * Whether the credit is for voice-only performance (e.g., voice acting). Optional.
     * Expected to be a boolean value (true/false).
     */
    voiceOnly: URLParamBooleanSchema,

    /**
     * Whether the credit is for a cameo appearance. Optional.
     * Expected to be a boolean value (true/false).
     */
    cameo: URLParamBooleanSchema,

    /**
     * Whether the credit involves motion capture performance. Optional.
     * Expected to be a boolean value (true/false).
     */
    motionCapture: URLParamBooleanSchema,
});

/**
 * Type representing the shape of validated movie credit match query parameters.
 * Inferred from {@link MovieCreditMatchQueryParamsSchema}.
 */
export type MovieCreditMatchQueryParams = z.infer<typeof MovieCreditMatchQueryParamsSchema>;