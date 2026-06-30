/**
 * @fileoverview Service for fetching and aggregating data for the showing admin view.
 */

import type {
    FetchShowingDetailsViewDataConfig,
    ShowingDetailsViewData
} from "@/domains/showing/_feat/admin-view-data/service/service.types";
import Showing from "@/domains/showing/models/showing/Showing.model";
import createHttpError from "http-errors";
import {Theatre} from "@/domains/theatre/model/theatre";
import {Screen} from "@/domains/screen/models/screen";
import {ScreenPopulationPaths} from "@/domains/screen/_feat/query-population";
import SeatMap from "@/domains/seatmap/model/SeatMap.model";
import {SeatMapPopulationPaths} from "@/domains/seatmap/_feat/query-population";
import {Movie} from "@/domains/movie/model/movie";
import {MoviePopulationPaths} from "@/domains/movie/_feat/query-population";
import {ShowingPopulationPaths} from "@/domains/showing/_feat/query-population";

/**
 * Fetches a showing and its associated movie, theatre, screen, and seating data.
 */
export async function fetchShowingDetailsViewData(
    {slug}: FetchShowingDetailsViewDataConfig
): Promise<ShowingDetailsViewData> {
    const showing = await Showing
        .findOne({slug})
        .populate(ShowingPopulationPaths)
        .lean({virtuals: true});

    if (!showing) {
        throw createHttpError(404, "Showing Not Found.");
    }

    const [movie, theatre, screen, seating] = await Promise.all([
        Movie.findById(showing.movie).populate(MoviePopulationPaths).lean({virtuals: true}),
        Theatre.findById(showing.theatre).lean({virtuals: true}),
        Screen.findById(showing.screen).populate(ScreenPopulationPaths).lean({virtuals: true}),
        SeatMap.find({showing: showing._id}).populate(SeatMapPopulationPaths).lean({virtuals: true}),
    ]);

    if (!movie || !theatre || !screen) {
        throw createHttpError(404, "Showing Elements Not Found.");
    }

    return {
        showing,
        movie,
        theatre,
        screen,
        seating,
    }
}