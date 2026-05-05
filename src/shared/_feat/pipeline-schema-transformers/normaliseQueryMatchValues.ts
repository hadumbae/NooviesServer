/**
 * @fileoverview Normalizes URL match query parameters into a Mongoose match stage format.
 */

import type {PipelineStage} from "mongoose";
import filterNullishAttributes from "@shared/utility/filterNullishAttributes";

/** Normalizes object parameters by removing nullish attributes and wrapping the result in a Mongoose match stage object. */
export function normaliseQueryMatchValues(values: Record<string, unknown>): PipelineStage.Match {
    return {
        $match: filterNullishAttributes(values),
    };
}