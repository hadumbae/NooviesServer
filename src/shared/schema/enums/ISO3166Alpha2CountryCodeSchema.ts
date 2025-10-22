import { z } from "zod";
import ISO3166Alpha2CodeConstant from "../../constants/country/ISO3166Alpha2CodeConstant.js";

/**
 * Schema representing a valid ISO 3166-1 alpha-2 country code.
 *
 * @remarks
 * - Validates that a string matches one of the predefined ISO alpha-2 codes
 *   (e.g., 'US', 'GB', 'IN', etc.).
 * - Throws a validation error with the message `"Invalid ISO Code."` if the
 *   value is not in the allowed list.
 * - Useful for ensuring consistent country code values across your application.
 *
 * @example
 * ```ts
 * ISO3166Alpha2CountryCodeSchema.parse("US");  // ✅ Valid
 * ISO3166Alpha2CountryCodeSchema.parse("USA"); // ❌ Throws ZodError: "Invalid ISO Code."
 * ```
 */
export const ISO3166Alpha2CountryCodeSchema = z.enum(ISO3166Alpha2CodeConstant, {
    message: "Invalid ISO Code.",
});

/**
 * TypeScript type representing a valid ISO 3166-1 alpha-2 country code.
 *
 * @remarks
 * - Inferred from {@link ISO3166Alpha2CountryCodeSchema}.
 * - Ensures any variable of this type will contain a valid ISO alpha-2 code.
 */
export type ISO3166Alpha2CountryCode = z.infer<typeof ISO3166Alpha2CountryCodeSchema>;
