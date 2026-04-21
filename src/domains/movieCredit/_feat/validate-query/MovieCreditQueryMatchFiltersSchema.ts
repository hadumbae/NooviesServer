/**
 * @fileoverview Validation schema for direct attribute filtering of MovieCredit entities.
 * These filters target properties persisted directly on the MovieCredit document.
 */

import {z} from "zod";
import {URLParamObjectIDSchema} from "@shared/schema/url/URLParamObjectIDSchema";
import {RoleTypeDepartmentEnumSchema} from "@domains/roleType/schemas/RoleTypeDepartment.enum";
import {URLParamNumberSchema} from "@shared/schema/url/URLParamNumberSchema";
import {URLParamBooleanSchema} from "@shared/schema/url/URLParamBooleanSchema";
import {URLParamRegexPatternSchema} from "@shared/_feat/parse-query-string";

/**
 * Zod schema defining match-level filters for MovieCredit queries.
 */
export const MovieCreditQueryMatchFiltersSchema = z.object({
    _id: URLParamObjectIDSchema,
    movie: URLParamObjectIDSchema,
    person: URLParamObjectIDSchema,
    roleType: URLParamObjectIDSchema,
    department: RoleTypeDepartmentEnumSchema.optional(),
    displayRoleName: URLParamObjectIDSchema,
    creditedAs: URLParamObjectIDSchema,
    isPrimary: URLParamBooleanSchema,
    characterName: URLParamRegexPatternSchema,
    billingOrder: URLParamNumberSchema,
    uncredited: URLParamBooleanSchema,
    voiceOnly: URLParamBooleanSchema,
    cameo: URLParamBooleanSchema,
    motionCapture: URLParamBooleanSchema,
    archiveFootage: URLParamBooleanSchema,
});

/**
 * TypeScript type inferred from MovieCreditQueryMatchFiltersSchema.
 */
export type MovieCreditQueryMatchFilters = z.infer<typeof MovieCreditQueryMatchFiltersSchema>;