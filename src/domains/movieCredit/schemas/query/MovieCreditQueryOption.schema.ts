import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {URLParamNumberSchema} from "../../../../shared/schema/url/URLParamNumberSchema.js";
import {URLParamBooleanSchema} from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import {RoleTypeDepartmentEnumSchema} from "../../../roleType/schemas/RoleTypeDepartment.enum.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

/**
 * Filters for matching {@link MovieCredit} documents in queries.
 * Typically used for root-level filtering by IDs or field values.
 *
 * @remarks
 * - CAST-specific fields: `characterName`, `billingOrder`, `uncredited`, `voiceOnly`, `cameo`, `motionCapture`, `archiveFootage`.
 * - CREW-specific fields: `department`, `displayRoleName`.
 */
export const MovieCreditQueryMatchFiltersSchema = z.object({
    /** Filter by MovieCredit ID */
    _id: URLParamObjectIDSchema,

    /** Filter by associated movie ID */
    movie: URLParamObjectIDSchema,

    /** Filter by associated person ID */
    person: URLParamObjectIDSchema,

    /** Filter by role type ID */
    roleType: URLParamObjectIDSchema,

    /** Filter by department ("CAST" or "CREW"), optional */
    department: RoleTypeDepartmentEnumSchema.optional(),

    /** Filter by how the role is displayed, optional */
    displayRoleName: URLParamObjectIDSchema,

    /** Filter by credited name if different from person's name, optional */
    creditedAs: URLParamObjectIDSchema,

    /** Filter by primary role flag */
    isPrimary: URLParamStringSchema,

    /** Filter by character name (CAST only) */
    characterName: URLParamStringSchema,

    /** Filter by billing order (CAST only) */
    billingOrder: URLParamNumberSchema,

    /** Filter by uncredited flag (CAST only) */
    uncredited: URLParamBooleanSchema,

    /** Filter by voice-only role (CAST only) */
    voiceOnly: URLParamBooleanSchema,

    /** Filter by cameo role (CAST only) */
    cameo: URLParamBooleanSchema,

    /** Filter by motion capture role (CAST only) */
    motionCapture: URLParamBooleanSchema,

    /** Filter by archive footage role (CAST only) */
    archiveFootage: URLParamBooleanSchema,
});

/**
 * Filters for populating related fields in {@link MovieCredit} queries.
 * Used to filter within referenced collections such as `person`, `movie`, or `roleType`.
 *
 * @remarks
 * - Applied during `$lookup` or `.populate()` operations.
 */
export const MovieCreditQueryReferenceFiltersSchema = z.object({
    /** Filter by person's name */
    name: URLParamStringSchema,

    /** Filter by movie title */
    title: URLParamStringSchema,

    /** Filter by role name */
    roleName: URLParamStringSchema,
});

/**
 * Combined filter schema including both root-level match filters
 * and reference/populate filters.
 */
export const MovieCreditQueryFiltersSchema =
    MovieCreditQueryMatchFiltersSchema.merge(MovieCreditQueryReferenceFiltersSchema);

/**
 * Sorting options for {@link MovieCredit} queries.
 * Accepts MongoDB sort order: `1` for ascending, `-1` for descending.
 *
 * @remarks
 * - CAST-only: `sortByBillingOrder`
 * - Applies to both root and referenced documents as needed.
 */
export const MovieCreditQueryMatchSortsSchema = z.object({
    /** Sort results by person */
    sortByPerson: URLParamMongooseSortOrderSchema,

    /** Sort results by movie */
    sortByMovie: URLParamMongooseSortOrderSchema,

    /** Sort results by department ("CAST" or "CREW") */
    sortByDepartment: URLParamMongooseSortOrderSchema,

    /** Sort results by billing order (CAST only) */
    sortByBillingOrder: URLParamMongooseSortOrderSchema,
});

/**
 * Combined query options schema including filters and sorting rules.
 *
 * @remarks
 * - Merges `MovieCreditQueryFiltersSchema` and `MovieCreditQueryMatchSortsSchema`.
 * - Use this schema to validate query parameters for search endpoints.
 *
 * @example
 * // Example query parameters
 * const query = {
 *   person: "64f0d4c9abc1234567890abc",
 *   title: "Inception",
 *   sortByMovie: -1,
 *   sortByBillingOrder: 1
 * };
 *
 * MovieCreditQueryOptionsSchema.parse(query);
 */
export const MovieCreditQueryOptionsSchema =
    MovieCreditQueryFiltersSchema.merge(MovieCreditQueryMatchSortsSchema);
