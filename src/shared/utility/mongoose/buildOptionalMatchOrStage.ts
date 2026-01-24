/**
 * @file buildOptionalMatchOrStage.ts
 *
 * Utility for building a MongoDB `$match` stage with optional `$or` conditions.
 *
 * Nullish (`null` / `undefined`) values are stripped before constructing
 * match clauses, allowing dynamic query composition without branching.
 */

import filterNullishAttributes from "../filterNullishAttributes.js";
import type {PipelineStage} from "mongoose";

/**
 * Builds a `$match` aggregation stage using `$or` conditions
 * derived from the provided key-value map.
 *
 * Behavior:
 * - Nullish values are ignored
 * - Each remaining entry becomes an individual `$or` condition
 * - Returns an empty `$match` stage when no valid entries exist
 *
 * @param values Field-value pairs to be converted into `$or` conditions
 * @returns MongoDB aggregation `$match` stage
 */
export function buildOptionalMatchOrStage(
    values: Record<string, unknown>,
): PipelineStage.Match {
    const filteredValues = filterNullishAttributes(values);
    const entries = Object.entries(filteredValues);

    if (entries.length > 0) {
        const orConditions = entries.map(([key, value]) => ({[key]: value}));

        return {
            $match: {
                $or: orConditions,
            },
        };
    }

    return {
        $match: {},
    };
}
