import {z} from "zod";
import ISO6391CodeConstant from "../../constants/language/ISO6391CodeConstant.js";

/**
 * A Zod schema for validating ISO 639-1 language codes.
 *
 * This schema only allows values that exist in `ISO6391CodeConstant`.
 * Example valid codes: `"en"`, `"fr"`, `"es"`, etc.
 *
 * @remarks
 * This schema will throw a validation error with the message `"Invalid ISO Code."`
 * if the input value is not a valid ISO 639-1 code.
 */
export const ISO6391LanguageCodeSchema = z.enum(ISO6391CodeConstant, {
    message: "Invalid ISO Code.",
});

/**
 * Represents a valid ISO 639-1 language code.
 *
 * This type is inferred from `ISO6391CodeEnumSchema`, so it only includes
 * strings that are present in `ISO6391CodeConstant`.
 *
 * Example values: `"en"`, `"fr"`, `"es"`, etc.
 */
export type ISO6391LanguageCode = z.infer<typeof ISO6391LanguageCodeSchema>;