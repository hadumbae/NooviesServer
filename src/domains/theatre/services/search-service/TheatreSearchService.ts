/**
 * @file TheatreSearchService.ts
 *
 * Aggregation-based search service for theatres with scheduled showings.
 *
 * Composes:
 * - Location-based theatre filtering
 * - Showing population and enrichment pipelines
 * - Faceted pagination with total counts
 * - Hard limits on theatre and showing result sizes
 */

import type {
    FetchShowingTheatreParams,
    FetchShowingTheatreReturns,
    TheatreSearchMethods,
} from "./TheatreSearchService.types.js";
import type {PipelineStage} from "mongoose";
import Theatre from "../../model/Theatre.model.js";
import {ShowingSeatMapVirtualPipelines} from "../../../showing/queries/ShowingSeatMapVirtualPipelines.js";
import {ShowingPopulationPipelines} from "../../../showing/queries/ShowingPopulationPipelines.js";
import {buildOptionalMatchOrStage} from "../../../../shared/utility/mongoose/buildOptionalMatchOrStage.js";

/**
 * Executes aggregation-driven theatre search queries involving showings.
 */
export class TheatreSearchService implements TheatreSearchMethods {

    /**
     * Returns paginated theatres that contain scheduled showings.
     *
     * Showings:
     * - Restricted to `SCHEDULED` status
     * - Sorted by descending start time
     * - Fully populated and seat-enriched
     * - Optionally capped per theatre
     *
     * Theatres:
     * - Filtered by provided location identifiers
     * - Excluded if no matching showings exist
     * - Sorted alphabetically
     * - Paginated using a faceted aggregation
     *
     * @param params Search filters and pagination options
     * @returns Paginated theatre results with total item count
     */
    async fetchPaginatedTheatresWithShowings(
        {page = 1, perPage = 20, identifiers, limit: showingLimit}: FetchShowingTheatreParams,
    ): Promise<FetchShowingTheatreReturns> {
        const {city, state, country, postalCode} = identifiers;
        const limitedPerPage = Math.min(perPage, 20);

        const matchStage = buildOptionalMatchOrStage({
            "location.city": city,
            "location.state": state,
            "location.country": country,
            "location.postalCode": postalCode,
        });

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
            matchStage,
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
