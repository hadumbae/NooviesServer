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
    ShowingsByScreensParams,
} from "./ScreenSearchService.types";
import {type PipelineStage} from "mongoose";
import {Screen} from "@domains/screen/models/screen";
import {ShowingPopulationPipelines} from "@domains/showing/queries/ShowingPopulationPipelines";
import {ShowingSeatMapVirtualPipelines} from "@domains/showing/queries/ShowingSeatMapVirtualPipelines";
import {getIdentifierFilter} from "@shared/utility/getIdentifierFilter";
import {Theatre} from "@domains/theatre/model/theatre";
import type {ScreenWithShowings} from "@domains/screen/models/screen/Screen.types";

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

        const {_id, location: {timezone},} = await Theatre
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
            {$match: {theatre: _id}},
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
