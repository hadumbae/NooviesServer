/**
 * @fileoverview Service for fetching screens and their associated showings for a specific theatre and date.
 */

import type {ScreenWithShowings} from "@/domains/screen/_models/screen/Screen.types";
import {getIdentifierFilter} from "@/shared/utility/getIdentifierFilter";
import {Theatre} from "@/domains/theatre/model/theatre/Theatre.model";
import {type PipelineStage, Types} from "mongoose";
import {ShowingPopulationPipelines} from "@/domains/showing/queries/ShowingPopulationPipelines";
import {ShowingSeatMapVirtualPipelines} from "@/domains/showing/queries/ShowingSeatMapVirtualPipelines";
import {Screen} from "@/domains/screen/_models/screen/Screen.model";
import type {SlugString} from "@/shared/schema/strings/SlugStringSchema";

/** Parameters for fetching showings grouped by screens. */
export type ShowingsByScreensParams = {
    theatreID: Types.ObjectId | SlugString;
    dateString: string;
};

/** Aggregates screens with their nested showings filtered by a specific date and theatre. */
export async function fetchShowingsByScreens(
    {theatreID, dateString}: ShowingsByScreensParams,
): Promise<ScreenWithShowings[]> {
    const idFilter = getIdentifierFilter(theatreID);

    const {_id, location: {timezone}} = await Theatre
        .findOne(idFilter)
        .select("location")
        .orFail();

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