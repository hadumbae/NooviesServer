/**
 * @file MovieCreditQuery.schema.ts
 * @summary
 * Zod schemas for movie credit query validation.
 *
 * @description
 * Defines composable Zod schemas for validating and parsing URL query
 * parameters used to filter and sort movie credit list endpoints.
 *
 * The schemas are structured in clear layers to mirror aggregation
 * pipeline construction:
 * - **Match filters**: Direct fields on the MovieCredit document
 * - **Reference filters**: Fields resolved via lookups or population
 * - **Sort options**: MongoDB-compatible sort directives
 *
 * These schemas are designed for use at the API boundary, enabling
 * safe query parsing, predictable aggregation building, and reliable
 * type inference.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "../../../../shared/schema/url/URLParamObjectIDSchema.js";
import {URLParamStringSchema} from "../../../../shared/schema/url/URLParamStringSchema.js";
import {URLParamNumberSchema} from "../../../../shared/schema/url/URLParamNumberSchema.js";
import {URLParamBooleanSchema} from "../../../../shared/schema/url/URLParamBooleanSchema.js";
import {RoleTypeDepartmentEnumSchema} from "../../../roleType/schemas/RoleTypeDepartment.enum.js";
import {URLParamMongooseSortOrderSchema} from "../../../../shared/schema/url/URLParamMongooseSortOrderSchema.js";

// --- MATCH ---

/**
 * Match-level query filters for MovieCredit documents.
 *
 * @remarks
 * These filters map directly to fields on the MovieCredit model and are
 * typically translated into MongoDB `$match` stages.
 */
export const MovieCreditQueryMatchFiltersSchema = z.object({
    _id: URLParamObjectIDSchema,
    movie: URLParamObjectIDSchema,
    person: URLParamObjectIDSchema,
    roleType: URLParamObjectIDSchema,
    department: RoleTypeDepartmentEnumSchema.optional(),
    displayRoleName: URLParamObjectIDSchema,
    creditedAs: URLParamObjectIDSchema,
    isPrimary: URLParamStringSchema,
    characterName: URLParamStringSchema,
    billingOrder: URLParamNumberSchema,
    uncredited: URLParamBooleanSchema,
    voiceOnly: URLParamBooleanSchema,
    cameo: URLParamBooleanSchema,
    motionCapture: URLParamBooleanSchema,
    archiveFootage: URLParamBooleanSchema,
});

/**
 * Sort options for MovieCredit queries.
 *
 * @remarks
 * Each property corresponds to a sortable field and accepts a MongoDB
 * sort order (`1` for ascending, `-1` for descending).
 *
 * These values are typically mapped directly to `$sort` stages.
 */
export const MovieCreditQueryMatchSortsSchema = z.object({
    sortByCreditedAs: URLParamMongooseSortOrderSchema,
    sortByCharacterName: URLParamMongooseSortOrderSchema,
    sortByBillingOrder: URLParamMongooseSortOrderSchema,
});

// --- REFERENCE ---

/**
 * Reference-level query filters for MovieCredit queries.
 *
 * @remarks
 * These filters apply to fields resolved via referenced documents
 * (e.g. movie slug, role name) and are usually evaluated after
 * `$lookup` or population stages.
 */
export const MovieCreditQueryReferenceFiltersSchema = z.object({
    movieSlug: URLParamStringSchema,
    roleName: URLParamStringSchema,
});

// --- COMBINED ---

/**
 * Combined filter schema for MovieCredit queries.
 *
 * @remarks
 * Merges match-level and reference-level filters into a single schema
 * for convenience when constructing aggregation pipelines.
 */
export const MovieCreditQueryFiltersSchema =
    MovieCreditQueryMatchFiltersSchema.merge(MovieCreditQueryReferenceFiltersSchema);

/**
 * Full query options schema for MovieCredit list/search endpoints.
 *
 * @remarks
 * Combines filters and sorting parameters into a single schema suitable
 * for validating raw URL query strings.
 */
export const MovieCreditQueryOptionsSchema =
    MovieCreditQueryFiltersSchema.merge(MovieCreditQueryMatchSortsSchema);
