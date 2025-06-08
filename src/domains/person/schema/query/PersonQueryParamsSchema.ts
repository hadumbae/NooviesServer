import {z} from "zod";
import {ISO3166Alpha2CodeEnumSchema} from "../../../../shared/schema/enums/country/ISO3166Alpha2CodeEnumSchema.js";
import {URLParamRegexStringSchema} from "../../../../shared/schema/url/URLParamRegexStringSchema.js";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";

/**
 * Zod schema for validating and transforming query parameters used to filter person records.
 *
 * @property _id - An optional MongoDB ObjectId string. If provided, it must be a valid ObjectId and
 *                 will be transformed into a `Types.ObjectId` instance.
 *
 * @property name - An optional name string for regex-based searching. Any special characters will be
 *                  escaped to ensure safe use in regex queries (e.g., MongoDB `$regex`).
 *
 * @property nationality - An optional ISO 3166-1 alpha-2 country code representing the person's nationality.
 *
 * @remarks
 * - All fields are optional, enabling partial filtering.
 * - The `_id` is validated using `Types.ObjectId.isValid()` and transformed into a `Types.ObjectId`.
 * - The `name` field is escaped to prevent regex injection.
 *
 * @example
 * ```ts
 * const query = {
 *   _id: "60c72b2f5f1b2c001cfb1234",
 *   name: "john.doe",
 *   nationality: "US"
 * };
 *
 * const parsed = PersonQueryParamsSchema.parse(query);
 * // parsed._id is now an ObjectId instance
 * // parsed.name is "john\\.doe" (escaped)
 * ```
 */
export const PersonQueryParamsSchema = z.object({
    _id: URLParamObjectIDSchema,
    name: URLParamRegexStringSchema,
    nationality: ISO3166Alpha2CodeEnumSchema.optional(),
});

/**
 * Type inferred from {@link PersonQueryParamsSchema}.
 */
export type PersonQueryParams = z.infer<typeof PersonQueryParamsSchema>;