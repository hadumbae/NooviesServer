/**
 * @fileoverview Service function to fetch theatre and related data for administrative views.
 */

import type {
    FetchTheatreScreenDataConfig,
    TheatreScreenData
} from "@domains/theatre/_feat/admin-view-data/service/service.types";
import {Theatre, type TheatreWithVirtuals} from "@domains/theatre/model/theatre";
import {Screen} from "@domains/screen/models/screen";
import {TheatreVirtualPopulationPaths} from "@domains/theatre/_feat/crud";
import createHttpError from "http-errors";
import {Seat} from "@domains/seat/model";

/**
 * Retrieves a theatre, a specific screen, and all associated seats based on provided slugs.
 */
export async function fetchTheatreScreenData(
    {theatreSlug, screenSlug}: FetchTheatreScreenDataConfig
): Promise<TheatreScreenData> {
    const theatre = await Theatre
        .findOne({slug: theatreSlug})
        .populate(TheatreVirtualPopulationPaths)
        .lean<TheatreWithVirtuals>({virtuals: true});

    if (!theatre) {
        throw createHttpError(404, "Theatre not found!");
    }

    const screen = await Screen.findOne({slug: screenSlug}).lean().orFail();

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