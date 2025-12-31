import type {UpdateQuery, UpdateWithAggregationPipeline} from "mongoose";

/**
 * Supported MongoDB update shapes.
 *
 * Includes standard update objects, aggregation pipelines,
 * or null when no update is provided.
 *
 * @template TData - Target schema shape
 */
type UpdateType<TData> =
    | UpdateWithAggregationPipeline
    | UpdateQuery<TData>
    | null;

/**
 * Extracts update payload data from a MongoDB update object.
 *
 * Safely returns the contents of `$set` when present.
 * Falls back to an empty object when no update data exists.
 *
 * @template TData - Expected update data shape
 * @param update - Mongoose update object or null
 * @returns Extracted update data
 */
export default function getUpdateData<TData>(update: UpdateType<TData>): TData {
    if (update && "$set" in update && typeof update.$set === "object") {
        return update.$set as TData;
    }

    return {} as TData;
}
