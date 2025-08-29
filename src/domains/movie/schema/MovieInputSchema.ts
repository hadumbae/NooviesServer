import {z} from "zod";
import {RequiredStringSchema} from "../../../shared/schema/strings/RequiredStringSchema.js";
import {UTCDateStringSchema} from "../../../shared/schema/date/DateString.schema.js";
import {PositiveNumberSchema} from "../../../shared/schema/numbers/PositiveNumberSchema.js";
import {ValidURLStringSchema} from "../../../shared/schema/strings/ValidURLStringSchema.js";
import {CoercedBooleanSchema} from "../../../shared/schema/booleans/CoercedBooleanSchema.js";
import {ISO6391CodeEnumSchema} from "../../../shared/schema/enums/language/ISO6391CodeEnumSchema.js";
import {ISO3166Alpha2CodeEnumSchema} from "../../../shared/schema/enums/country/ISO3166Alpha2CodeEnumSchema.js";
import {isMulterFile} from "../../../shared/utility/zod/TypeChecks.js";
import ImageTypeConstant from "../../../shared/constants/ImageTypeConstant.js";
import {ObjectIdStringSchema} from "../../../shared/schema/strings/ObjectIdStringSchema.js";

/**
 * Schema describing the expected input for creating or updating a movie entity.
 *
 * Validates required fields, length limits, enum constraints, and optional fields.
 */
export const MovieInputSchema = z.object({
    /**
     * The localized or display title of the movie.
     * - Required
     * - Max length: 250 characters
     */
    title: RequiredStringSchema
        .max(250, "Must be 250 characters or less."),

    /**
     * The original title of the movie (before translation/localization).
     * - Required
     * - Max length: 250 characters
     */
    originalTitle: RequiredStringSchema
        .max(250, "Must be 250 characters or less."),

    /**
     * The tagline or slogan associated with the movie.
     * - Optional
     * - Nullable
     * - Max length: 100 characters
     */
    tagline: RequiredStringSchema
        .max(100, "Must be 100 characters or less.")
        .optional()
        .nullable(),

    /**
     * A short synopsis or description of the movie.
     * - Required
     * - Trimmed
     * - Max length: 2000 characters
     */
    synopsis: RequiredStringSchema
        .trim()
        .max(2000, "Must be 2000 characters or less."),

    /**
     * An array of genre IDs the movie belongs to.
     * - Required
     * - Each item must be a valid `IDInstance`
     */
    genres: z.array(ObjectIdStringSchema, {
        required_error: "Required.",
        invalid_type_error: "Must be an array of IDs.",
    }),

    /**
     * The official release date of the movie in UTC format.
     * - Optional
     * - Nullable
     */
    releaseDate: UTCDateStringSchema
        .optional()
        .nullable(),

    /**
     * Whether the movie has been officially released.
     * - Optional
     */
    isReleased: CoercedBooleanSchema
        .optional(),

    /**
     * The runtime duration of the movie in minutes.
     * - Required
     * - Must be a positive number
     * - Max value: 500
     */
    runtime: PositiveNumberSchema
        .lte(500, "Must be 500 or less."),

    /**
     * The ISO 639-1 language code of the movie's original language.
     * - Required
     */
    originalLanguage: ISO6391CodeEnumSchema,

    /**
     * The ISO 3166-1 alpha-2 country code of the movie’s primary country of production.
     * - Required
     */
    country: ISO3166Alpha2CodeEnumSchema,

    /**
     * Languages available in the movie (audio tracks).
     * - Required
     * - Array of ISO 639-1 codes
     */
    languages: z.array(ISO6391CodeEnumSchema),

    /**
     * Subtitles available for the movie.
     * - Required
     * - Array of ISO 639-1 codes
     */
    subtitles: z.array(ISO6391CodeEnumSchema),

    /**
     * A valid URL pointing to the movie's trailer.
     * - Optional
     * - Nullable
     */
    trailerURL: ValidURLStringSchema
        .optional()
        .nullable(),

    /**
     * Whether the movie is currently available for viewing (e.g., in catalog).
     * - Optional
     */
    isAvailable: CoercedBooleanSchema.optional(),
});

/**
 * Schema for validating movie image uploads.
 *
 * Validates that:
 * - A file is provided
 * - The file is a valid Multer file
 * - The file's MIME type is allowed (matches `ImageTypeConstant`)
 */
export const MovieImageInputSchema = z.object({
    /**
     * The uploaded file object (e.g., from Multer).
     * - Required
     */
    file: z.any(),
}).superRefine(({file}, ctx) => {
    // Check if a file is provided
    if (!file) {
        ctx.addIssue({code: "custom", path: ['image'], message: "Required.", fatal: true});
        return z.NEVER;
    }

    // Check if the file is a valid Multer file
    if (!isMulterFile(file)) {
        ctx.addIssue({code: "custom", path: ['image'], message: "Invalid file.", fatal: true});
        return z.NEVER;
    }

    // Check if the file type is allowed
    if (!ImageTypeConstant.includes(file.mimetype as any)) {
        ctx.addIssue({code: "custom", path: ['image'], message: "Invalid file type.", fatal: true});
        return z.NEVER;
    }
});