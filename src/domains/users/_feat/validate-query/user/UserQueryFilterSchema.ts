/**
 * @fileoverview Zod schema for validating user-related search query filters.
 */

import {z} from "zod";
import {UserRoleSchema} from "@/domains/users/validation/fields";
import {buildArrayOperatorSchema, URLParamRegexPatternSchema} from "@/shared/_feat/parse-query-string";
import preprocessEmptyToUndefined from "@/shared/utility/schema/preprocessors/preprocessEmptyToUndefined";

const roleSchema = buildArrayOperatorSchema({schema: UserRoleSchema, operator: "$all"});

/** Zod schema for validating user query filter parameters. */
export const UserQueryFilterSchema = z.object({
    name: URLParamRegexPatternSchema,
    email: URLParamRegexPatternSchema,
    uniqueCode: URLParamRegexPatternSchema,
    roles: preprocessEmptyToUndefined(roleSchema.optional()).optional(),
});

/** Type definition for user query filters inferred from the schema. */
export type UserQueryFilters = z.infer<typeof UserQueryFilterSchema>;