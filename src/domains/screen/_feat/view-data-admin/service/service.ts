import {Theatre, type TheatreWithVirtuals} from "@domains/theatre/model/theatre";
import {TheatreVirtualPopulationPaths} from "@domains/theatre/_feat/crud";
import createHttpError from "http-errors";
import {Screen} from "@domains/screen/models/screen";
import {Seat} from "@domains/seat/model";
import type {
    FetchTheatreScreenDetailsViewDataConfig,
    TheatreScreenDetailsViewData
} from "@domains/screen/_feat/view-data-admin";

/**
 * Aggregates data for a specific screen management view.
 */
export async function fetchTheatreScreenDetailsViewData(
    {theatreSlug, screenSlug}: FetchTheatreScreenDetailsViewDataConfig
): Promise<TheatreScreenDetailsViewData> {
    const theatre = await Theatre
        .findOne({slug: theatreSlug})
        .populate(TheatreVirtualPopulationPaths)
        .lean<TheatreWithVirtuals>({virtuals: true});

    if (!theatre) {
        throw createHttpError(404, "Theatre not found!");
    }

    const screen = await Screen.findOne({slug: screenSlug}).lean();

    if (!screen) {
        throw createHttpError(404, "Screen not found!");
    }

    const seats = await Seat.find({screen: screen._id}).lean();

    return {
        theatre,
        screen,
        seats,
    };
}