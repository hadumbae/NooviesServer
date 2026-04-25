/**
 * @fileoverview Data aggregation service for Theatre administrative views.
 */

import type {
    FetchTheatreDetailsViewDataConfig,
    FetchTheatreShowingListViewDataConfig,
    TheatreDetailsViewData,
    TheatreShowingListViewData
} from "@domains/theatre/_feat/admin-view-data/service/service.types";
import {Theatre, type TheatreWithVirtuals} from "@domains/theatre/model/theatre";
import {Screen, type ScreenSchemaFields} from "@domains/screen/models/screen";
import {TheatreVirtualPopulationPaths} from "@domains/theatre/_feat/crud";
import createHttpError from "http-errors";
import {buildPaginationPipelines} from "@shared/_feat/pagination-pipelines";
import type {PipelineStage} from "mongoose";
import Showing from "@domains/showing/models/showing/Showing.model";
import {ShowingPopulationPaths} from "@domains/showing/_feat/query-population";
import type {PaginationReturns} from "@shared/types/PaginationReturns";
import {ScreenVirtualPipelines} from "@domains/screen/_feat/aggregate";

/**
 * Aggregates data for the comprehensive Theatre Details dashboard.
 */
export async function fetchTheatreDetailsViewData(
    {slug, screenPage = 1, screenPerPage = 25, showingLimit = 10}: FetchTheatreDetailsViewDataConfig
): Promise<TheatreDetailsViewData> {
    const theatre = await Theatre
        .findOne({slug})
        .populate(TheatreVirtualPopulationPaths)
        .lean<TheatreWithVirtuals>({virtuals: true});

    if (!theatre) {
        throw createHttpError(404, "Theatre not found!");
    }

    const [screens] = await Screen.aggregate<PaginationReturns<ScreenSchemaFields>>([
        {$match: {theatre: theatre._id}},
        ...buildPaginationPipelines({
            innerStages: [
                {$sort: {name: 1}},
                {$skip: (screenPage - 1) * screenPerPage},
                {$limit: screenPerPage},
                ...(ScreenVirtualPipelines as PipelineStage.FacetPipelineStage[])
            ],
        }),
    ]);

    const showings = await Showing
        .find({theatre: theatre._id, status: "SCHEDULED"})
        .sort({startTime: -1})
        .limit(showingLimit)
        .populate(ShowingPopulationPaths)
        .lean({virtuals: true});

    return {
        theatre,
        screens,
        showings,
    };
}

/**
 * Aggregates paginated showings and theatre context for the showing list view.
 */
export async function fetchTheatreShowingListViewData(
    {slug, page = 1, perPage = 20}: FetchTheatreShowingListViewDataConfig
): Promise<TheatreShowingListViewData> {
    const theatre = await Theatre
        .findOne({slug})
        .populate(TheatreVirtualPopulationPaths)
        .lean<TheatreWithVirtuals>({virtuals: true});

    if (!theatre) {
        throw createHttpError(404, "Theatre not found!");
    }

    const [totalItems, items] = await Promise.all([
        Showing.countDocuments({theatre: theatre._id}),
        Showing
            .find({theatre: theatre._id})
            .sort({startTime: -1})
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate(ShowingPopulationPaths)
            .lean({virtuals: true}),
    ]);

    return {
        theatre,
        showings: {totalItems, items},
    }
}