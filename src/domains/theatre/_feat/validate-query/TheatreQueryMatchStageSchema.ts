/**
 * @fileoverview Zod schema for transforming theatre query match parameters into a Mongoose match stage.
 */

import {z} from "zod";
import {TheatreQueryMatchFilterSchema} from "@/domains/theatre/_feat/validate-query/TheatreQueryMatchFilterSchema";
import filterNullishAttributes from "@/shared/utility/filterNullishAttributes";

/** Zod schema that transforms theatre query match values into a Mongoose match pipeline stage. */
export const TheatreQueryMatchStageSchema = TheatreQueryMatchFilterSchema.transform(values => ({
    $match: filterNullishAttributes({
        name: values.name,
        seatCapacity: values.seatCapacity,
        "location.street": values.street,
        "location.city": values.city,
        "location.state": values.state,
        "location.country": values.country,
        "location.postalCode": values.postalCode,
        "location.timezone": values.timezone,
    }),
}));

/** Inferred type representing the validated and transformed Mongoose match stage for theatres. */
export type TheatreQueryMatchStage = z.infer<typeof TheatreQueryMatchStageSchema>;