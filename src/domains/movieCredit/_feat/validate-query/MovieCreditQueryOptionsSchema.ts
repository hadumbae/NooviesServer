/**
 * @fileoverview Transformation logic for MovieCredit query options.
 * Consolidates complex credit filters and sort orders into a structured
 * Mongoose aggregation pipeline configuration.
 */

import {z} from "zod";
import {
    MovieCreditQueryMatchFiltersSchema
} from "@domains/movieCredit/_feat/validate-query/MovieCreditQueryMatchFiltersSchema";
import {
    MovieCreditQueryMatchSortsSchema
} from "@domains/movieCredit/_feat/validate-query/MovieCreditQueryMatchSortsSchema";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";

/**
 * Composite Zod schema for MovieCredit query options with an aggregation transformation.
 */
export const MovieCreditQueryOptionsSchema = MovieCreditQueryMatchFiltersSchema
    .merge(MovieCreditQueryMatchSortsSchema)
    .transform(
        (values): AggregateQueryOptions => ({
            match: {
                /** Constructs the MongoDB $match stage for the aggregation pipeline. */
                filters: {
                    $match: filterNullishAttributes({
                        _id: values._id,
                        movie: values.movie,
                        person: values.person,
                        roleType: values.roleType,
                        department: values.department,
                        displayRoleName: values.displayRoleName,
                        creditedAs: values.creditedAs,
                        isPrimary: values.isPrimary,
                        characterName: values.characterName,
                        billingOrder: values.billingOrder,
                        uncredited: values.uncredited,
                        voiceOnly: values.voiceOnly,
                        cameo: values.cameo,
                        motionCapture: values.motionCapture,
                        archiveFootage: values.archiveFootage,
                    }),
                },
                /** Constructs the MongoDB $sort stage for the aggregation pipeline. */
                sorts: {
                    $sort: filterNullishAttributes({
                        creditedAs: values.sortByCreditedAs,
                        characterName: values.sortByCharacterName,
                        billingOrder: values.sortByBillingOrder,
                    }),
                }
            }
        }),
    );

/**
 * TypeScript type inferred from the transformed MovieCreditQueryOptionsSchema.
 */
export type MovieCreditQueryOptions = z.infer<typeof MovieCreditQueryOptionsSchema>;