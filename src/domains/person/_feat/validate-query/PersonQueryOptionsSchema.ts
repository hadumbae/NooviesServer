/**
 * @fileoverview Combined validation schema and type for Person query options.
 * Maps raw query parameters to Mongoose-compatible aggregate options.
 */

import {z} from "zod";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";
import {PersonQueryMatchFiltersSchema} from "@domains/person/_feat/validate-query/PersonQueryMatchFiltersSchema";
import {PersonQueryMatchSortsSchema} from "@domains/person/_feat/validate-query/PersonQueryMatchSortsSchema";

/**
 * Merges filter and sort schemas, transforming them into a structured AggregateQueryOptions object.
 */
export const PersonQueryOptionsSchema = PersonQueryMatchSortsSchema
    .merge(PersonQueryMatchFiltersSchema)
    .transform((values): AggregateQueryOptions => ({
        match: {
            filters: {
                $match: filterNullishAttributes({
                    _id: values._id,
                    name: values.name && {$regex: values.name, $options: "i"},
                    dob: values.dob,
                    nationality: values.nationality,
                })
            },
            sorts: {
                $sort: filterNullishAttributes({
                    name: values.sortByName,
                    dob: values.sortByDOB,
                    nationality: values.sortByNationality,
                })
            },
        }
    }));

/**
 * Type representing the validated and transformed query options for Person documents.
 */
export type PersonQueryOptions = z.infer<typeof PersonQueryOptionsSchema>;