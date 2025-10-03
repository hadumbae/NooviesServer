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
 * Validates required fields, optional fields, string lengths, enum constraints, arrays, and boolean flags.
 */
export const MovieInputSchema = z.object({
    /** Localized or display title of the movie. Required, max 250 characters. */
    title: RequiredStringSchema.max(250, "Must be 250 characters or less."),

    /** Original title of the movie. Optional, max 250 characters. */
    originalTitle: RequiredStringSchema
        .max(250, "Must be 250 characters or less.")
        .optional(),

    /** Tagline or slogan. Optional and nullable, max 100 characters. */
    tagline: RequiredStringSchema
        .max(100, "Must be 100 characters or less.")
        .optional()
        .nullable(),

    /** Short synopsis or description. Required, trimmed, max 2000 characters. */
    synopsis: RequiredStringSchema
        .trim()
        .max(2000, "Must be 2000 characters or less."),

    /** Array of genre IDs the movie belongs to. Required. */
    genres: z.array(ObjectIdStringSchema, {
        required_error: "Required.",
        invalid_type_error: "Must be an array of IDs.",
    }),

    /** Official release date in UTC. Optional and nullable. */
    releaseDate: UTCDateStringSchema.optional().nullable(),

    /** Whether the movie has been officially released. Optional boolean. */
    isReleased: CoercedBooleanSchema.optional(),

    /** Runtime in minutes. Required, positive number, max 500. */
    runtime: PositiveNumberSchema.lte(500, "Must be 500 or less."),

    /** ISO 639-1 code of the movie's original language. Required. */
    originalLanguage: ISO6391CodeEnumSchema,

    /** ISO 3166-1 alpha-2 code of the movie's primary country. Required. */
    country: ISO3166Alpha2CodeEnumSchema,

    /** Available audio languages (ISO 639-1 codes). Required array. */
    languages: z.array(ISO6391CodeEnumSchema),

    /** Available subtitles (ISO 639-1 codes). Required array. */
    subtitles: z.array(ISO6391CodeEnumSchema),

    /** Trailer URL. Optional and nullable, must be a valid URL. */
    trailerURL: ValidURLStringSchema.optional().nullable(),

    /** Whether the movie is currently available for viewing. Optional boolean. */
    isAvailable: CoercedBooleanSchema.optional(),
});

/**
 * Schema for validating movie image uploads.
 *
 * Ensures that:
 * - A file is provided
 * - The file is a valid Multer file
 * - The file's MIME type is allowed
 */
export const MovieImageInputSchema = z.object({
    /** The uploaded file object (from Multer). Required. */
    file: z.any(),
}).superRefine(({file}, ctx) => {
    if (!file) {
        ctx.addIssue({code: "custom", path: ['image'], message: "Required.", fatal: true});
        return z.NEVER;
    }

    if (!isMulterFile(file)) {
        ctx.addIssue({code: "custom", path: ['image'], message: "Invalid file.", fatal: true});
        return z.NEVER;
    }

    if (!ImageTypeConstant.includes(file.mimetype as any)) {
        ctx.addIssue({code: "custom", path: ['image'], message: "Invalid file type.", fatal: true});
        return z.NEVER;
    }
});
