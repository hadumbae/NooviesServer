/**
 * @fileoverview Transformation logic for RoleType query options.
 * Maps raw URL parameters into a structured Mongoose aggregation pipeline configuration.
 */

import {z} from "zod";
import {RoleTypeQueryMatchFiltersSchema} from "@domains/roleType/_feat/validate-query/RoleTypeQueryMatchFiltersSchema";
import {RoleTypeQueryMatchSortsSchema} from "@domains/roleType/_feat/validate-query/RoleTypeQueryMatchSortsSchema";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";

/**
 * Composite Zod schema for RoleType query options with an aggregation transformation.
 */
export const RoleTypeQueryOptionsSchema = RoleTypeQueryMatchSortsSchema
    .merge(RoleTypeQueryMatchFiltersSchema)
    .transform(
        (values): AggregateQueryOptions => ({
            match: {
                filters: {
                    $match: filterNullishAttributes({
                        roleName: values.roleName,
                        department: values.department,
                    }),
                },
                sorts: {
                    $sort: filterNullishAttributes({
                        roleName: values.sortByRoleName,
                        department: values.sortByDepartment,
                    }),
                },
            },
        })
    );

/**
 * TypeScript type representing the fully transformed RoleType query options.
 */
export type RoleTypeQueryOptions = z.infer<typeof RoleTypeQueryOptionsSchema>;