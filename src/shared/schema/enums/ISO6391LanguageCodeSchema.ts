import {z} from "zod";
import ISO6391CodeConstant from "../../constants/language/ISO6391CodeConstant.js";

/**
 * Schema for validating ISO 639-1 language codes.
 *
 * @remarks
 * - Only allows values present in {@link ISO6391CodeConstant}, e.g., `"en"`, `"fr"`, `"es"`.
 * - Throws a validation error with the message `"Invalid ISO Code."` if the input
 *   is not a valid ISO 639-1 code.
 * - Useful for validating language codes in APIs, forms, or database entries.
 *
 * @example
 * ```ts
 * ISO6391LanguageCodeSchema.parse("en"); // ✅ Valid
 * ISO6391LanguageCodeSchema.parse("de"); // ✅ Valid
 * ISO6391LanguageCodeSchema.parse("eng"); // ❌ Throws ZodError: "Invalid ISO Code."
 * ```
 */
export const ISO6391LanguageCodeSchema = z.enum(
    ISO6391CodeConstant,
    {message: "Invalid ISO Code."},
);

/**
 * TypeScript type representing a valid ISO 639-1 language code.
 *
 * @remarks
 * - Inferred from {@link ISO6391LanguageCodeSchema}.
 * - Ensures any variable of this type will be a valid ISO 639-1 code from the allowed list.
 *
 * @example
 * ```ts
 * const lang: ISO6391LanguageCode = "fr";
 * ```
 */
export type ISO6391LanguageCode = z.infer<typeof ISO6391LanguageCodeSchema>;
