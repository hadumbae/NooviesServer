/**
 * @file TheatreSearchService.ts
 *
 * Aggregation-based search service for theatres with scheduled showings.
 *
 * Composes:
 * - Location-based theatre filtering
 * - Showing population and seat enrichment
 * - Faceted pagination with total counts
 * - Hard limits on theatre and showing result sizes
 */

import type {
    FetchTheatreByLocationParams,
    FetchTheatreByLocationReturns,
    TheatreSearchMethods,
} from "./TheatreSearchService.types.js";
import type {PipelineStage} from "mongoose";
import Theatre from "../../model/Theatre.model.js";
import {ShowingSeatMapVirtualPipelines} from "../../../showing/queries/ShowingSeatMapVirtualPipelines.js";
import {ShowingPopulationPipelines} from "../../../showing/queries/ShowingPopulationPipelines.js";

/**
 * Executes aggregation-driven theatre search queries involving showings.
 */
export class TheatreSearchService implements TheatreSearchMethods {

    /**
     * Fetches paginated theatres that contain scheduled showings
     * matching a location target.
     *
     * Showings:
     * - Restricted to `SCHEDULED` status
     * - Sorted by descending start time
     * - Fully populated and seat-enriched
     * - Optionally capped per theatre
     *
     * Theatres:
     * - Matched against location fields using a single target value
     * - Excluded if no scheduled showings exist
     * - Sorted alphabetically
     * - Paginated via a faceted aggregation
     *
     * @param params Location filter, pagination, and showing limits
     * @returns Paginated theatre results with total item count
     */
    async fetchPaginatedTheatresByLocation(
        {target, page = 1, perPage = 20, limit: showingLimit}: FetchTheatreByLocationParams,
    ): Promise<FetchTheatreByLocationReturns> {
        const limitedPerPage = Math.min(perPage, 20);

        const showingPipelines: PipelineStage[] = [
            {$match: {status: "SCHEDULED"}},
            {$sort: {startTime: -1}},
            ...ShowingPopulationPipelines,
            ...ShowingSeatMapVirtualPipelines,
        ];

        if (showingLimit) {
            showingPipelines.push({$limit: Math.min(showingLimit, 10)});
        }

        const pipelines: PipelineStage[] = [
            {
                $match: {
                    $or: [
                        {"location.city": target},
                        {"location.state": target},
                        {"location.country": target},
                        {"location.postalCode": target},
                    ],
                },
            },
            {
                $lookup: {
                    from: "showings",
                    localField: "_id",
                    foreignField: "theatre",
                    as: "showings",
                    pipeline: showingPipelines as any[],
                },
            },
            {
                $match: {showings: {$ne: []}},
            },
            {
                $facet: {
                    totalData: [{$count: "count"}],
                    items: [
                        {$sort: {name: 1}},
                        {$skip: (page - 1) * limitedPerPage},
                        {$limit: limitedPerPage},
                    ],
                },
            },
            {
                $project: {
                    totalItems: {$ifNull: [{$arrayElemAt: ["$totalData.count", 0]}, 0]},
                    items: 1,
                },
            },
        ];

        const [result] = await Theatre.aggregate(pipelines);

        return result;
    }
}
