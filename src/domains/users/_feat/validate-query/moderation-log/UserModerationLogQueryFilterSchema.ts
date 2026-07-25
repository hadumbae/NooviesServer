/**
 * @fileoverview Zod schema for validating user moderation log query filters.
 */

import {z} from "zod";
import preprocessEmptyToUndefined from "@/shared/utility/schema/preprocessors/preprocessEmptyToUndefined";
import {URLParamObjectIDSchema} from "@/shared/schema/url/URLParamObjectIDSchema";
import {UserModerationLogActionSchema} from "@/domains/users";

/** Schema for filtering user moderation logs by user ID and action type. */
export const UserModerationLogQueryFilterSchema = z.object({
    user: URLParamObjectIDSchema,
    action: preprocessEmptyToUndefined(UserModerationLogActionSchema.optional()).optional(),
});

/** Type definition for user query filters inferred from the schema. */
export type UserModerationLogQueryFilters = z.infer<typeof UserModerationLogQueryFilterSchema>;