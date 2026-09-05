/**
 * @fileoverview Zod schema for transforming theatre query sort parameters into a Mongoose sort stage.
 */

import {z} from "zod";
import {TheatreQueryMatchSortSchema} from "@/domains/theatre/_feat/validate-query/TheatreQueryMatchSortSchema";
import {filterNullishAttributes} from "@/shared/utility/filterNullishAttributes";

/** Zod schema that transforms theatre query sort values into a Mongoose sort pipeline stage. */
export const TheatreQuerySortStageSchema = TheatreQueryMatchSortSchema.transform((values) => ({
    $sort: filterNullishAttributes({
        name: values.sortByName,
        seatCapacity: values.sortBySeatCapacity,
        "location.city": values.sortByCity,
        "location.state": values.sortByState,
        "location.country": values.sortByCountry,
        "location.postalCode": values.sortByPostalCode,
        "location.timezone": values.sortByTimezone,
    }),
}));

/** Inferred type representing the validated and transformed Mongoose sort stage for theatres. */
export type TheatreQuerySortStage = z.infer<typeof TheatreQuerySortStageSchema>;