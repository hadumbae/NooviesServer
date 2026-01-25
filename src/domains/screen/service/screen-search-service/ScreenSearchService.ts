/**
 * @file ScreenSearchService.ts
 *
 * Service layer for querying screens and their associated showings.
 *
 * Uses MongoDB aggregation pipelines to:
 * - Resolve theatre timezone
 * - Filter showings by local date
 * - Populate related entities and virtuals
 */

import type {
    ScreenSearchMethods,
    ScreenWithShowings,
    ShowingsByScreensParams,
} from "./ScreenSearchService.types.js";
import {type PipelineStage} from "mongoose";
import Screen from "../../model/Screen.model.js";
import Theatre from "../../../theatre/model/Theatre.model.js";
import {ShowingPopulationPipelines} from "../../../showing/queries/ShowingPopulationPipelines.js";
import {ShowingSeatMapVirtualPipelines} from "../../../showing/queries/ShowingSeatMapVirtualPipelines.js";
import {getIdentifierFilter} from "../../../../shared/utility/getIdentifierFilter.js";

/**
 * Service for screen-based showing search operations.
 */
export class ScreenSearchService implements ScreenSearchMethods {
    /**
     * Fetches screens within a theatre along with their showings
     * for a specific local calendar date.
     *
     * - Dates are resolved using the theatre's timezone
     * - Showings are populated and sorted by start time
     *
     * @param params - Theatre identifier and target date
     * @returns Screens with populated showings for the given date
     */
    async fetchShowingsByScreens(
        {theatreID, dateString}: ShowingsByScreensParams,
    ): Promise<ScreenWithShowings[]> {
        const idFilter = getIdentifierFilter(theatreID);

        const {location: {timezone},} = await Theatre
            .findOne(idFilter)
            .select("location")
            .orFail();

        /**
         * Pipeline applied inside the `$lookup` for showings.
         *
         * Resolves local date using theatre timezone and filters
         * showings to the requested calendar date.
         */
        const showingPipeline: PipelineStage[] = [
            {
                $addFields: {
                    localDate: {
                        $dateToString: {
                            date: "$startTime",
                            timezone,
                            format: "%Y-%m-%d",
                        },
                    },
                },
            },
            {$match: {localDate: dateString}},
            {$sort: {startTime: -1}},
            ...ShowingPopulationPipelines,
            ...ShowingSeatMapVirtualPipelines,
        ];

        /**
         * Root aggregation pipeline for screens.
         */
        const pipeline: PipelineStage[] = [
            {$match: {theatre: theatreID}},
            {
                $lookup: {
                    from: "showings",
                    localField: "_id",
                    foreignField: "screen",
                    as: "showings",
                    pipeline: showingPipeline as any[],
                },
            },
            {
                $lookup: {
                    from: "theatres",
                    localField: "theatre",
                    foreignField: "_id",
                    as: "theatre",
                },
            },
            {
                $unwind: {
                    path: "$theatre",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];

        return Screen.aggregate(pipeline);
    }
}
