/**
 * @fileoverview Unified validation schema for all Theatre-related query operations.
 * Consolidates filtering criteria and sorting instructions into a single schema.
 */

import {z} from "zod";
import {TheatreQueryMatchFilterSchema} from "@domains/theatre/_feat/validate-query/TheatreQueryMatchFilterSchema";
import {TheatreQueryMatchSortSchema} from "@domains/theatre/_feat/validate-query/TheatreQueryMatchSortSchema";
import type {AggregateQueryOptions} from "@shared/_feat/generic-aggregate";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";

/**
 * Composite Zod schema for Theatre query options.
 */
export const TheatreQueryOptionSchema = TheatreQueryMatchFilterSchema.merge(TheatreQueryMatchSortSchema).transform(
    (values): AggregateQueryOptions => ({
        match: {
            filters: {
                $match: filterNullishAttributes({
                    name: values.name,
                    seatCapacity: values.seatCapacity,
                    street: values.street,
                    city: values.city,
                    state: values.state,
                    country: values.country,
                    postalCode: values.postalCode,
                    timezone: values.timezone,
                })
            },
            sorts: {
                $sort: filterNullishAttributes({
                    name: values.sortByName,
                    seatCapacity: values.sortBySeatCapacity,
                    city: values.sortByCity,
                    state: values.sortByState,
                    country: values.sortByCountry,
                    postalCode: values.sortByPostalCode,
                    timezone: values.sortByTimezone,
                })
            },
        }
    })
);

/**
 * TypeScript type inferred from TheatreQueryOptionSchema.
 */
export type TheatreQueryOptions = z.infer<typeof TheatreQueryOptionSchema>;