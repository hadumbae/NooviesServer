import {z} from "zod";
import ISO3166Alpha2CodeConstant from "../../../constants/country/ISO3166Alpha2CodeConstant.js";

/**
 * A Zod schema representing a valid ISO 3166-1 alpha-2 country code.
 *
 * This schema validates strings against a predefined list of ISO alpha-2 codes,
 * such as 'US', 'GB', 'IN', etc. If the value does not match one of the allowed codes,
 * a validation error with the message "Invalid ISO Code." will be thrown.
 *
 * @example
 * ISO3166Alpha2CodeEnumSchema.parse("US"); // ✅ Valid
 * ISO3166Alpha2CodeEnumSchema.parse("USA"); // ❌ Throws ZodError: "Invalid ISO Code."
 */
export const ISO3166Alpha2CodeEnumSchema = z.enum(ISO3166Alpha2CodeConstant, {message: "Invalid ISO Code."});

/**
 * Type representing a valid ISO 3166-1 alpha-2 country code.
 *
 * Inferred from {@link ISO3166Alpha2CodeEnumSchema}, this type can be used
 * throughout your application to ensure correct and validated country code values.
 */
export type ISO3166Alpha2Code = z.infer<typeof ISO3166Alpha2CodeEnumSchema>;