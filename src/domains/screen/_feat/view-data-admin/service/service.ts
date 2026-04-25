/**
 * @fileoverview Logic for aggregating data required by the Theatre Screen Details administrative view.
 * Performs parallel or sequential lookups to build a unified context of Theatre, Screen, and Seats.
 */

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
 * Fetches the complete dataset for managing a specific screen.
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