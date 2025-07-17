import {z} from "zod";
import {timeZonesNames} from "@vvo/tzdb";

/**
 * Zod schema validating valid IANA timezones.
 *
 * The list is sourced from `@vvo/tzdb` and includes all valid identifiers such as:
 * `"Asia/Yangon"`, `"America/New_York"`, `"Europe/London"`, etc.
 *
 * If the input value is not a valid timezone identifier,
 * this schema will throw a ZodError with the message:
 * `"Invalid Time Zone."`
 *
 * @example
 * ```ts
 * IANATimezoneSchema.parse("Asia/Yangon");       // ✅ Returns "Asia/Yangon"
 * IANATimezoneSchema.parse("Invalid/Timezone");  // ❌ Throws ZodError("Invalid Time Zone.")
 * ```
 */
export const IANATimezoneSchema = z.enum(timeZonesNames as [string, ...string[]], {message: "Invalid Time Zone."});

/**
 * TypeScript type for valid IANA timezones, inferred from `IANATimezoneSchema`.
 *
 * Example:
 * ```ts
 * let tz: IANATimezone = "Asia/Yangon";          // ✅ OK
 * tz = "Mars/Base";                              // ❌ TS error
 * ```
 */
export type IANATimezone = z.infer<typeof IANATimezoneSchema>;