/**
 * @fileoverview Logic for aggregating data required by the Theatre Screen Details administrative view.
 * Performs parallel or sequential lookups to build a unified context of Theatre, Screen, and Seats.
 */

import {Theatre, type TheatreWithVirtuals} from "@/domains/theatre/model/theatre";
import {TheatreVirtualPopulationPaths} from "@/domains/theatre/_feat/crud";
import createHttpError from "http-errors";
import {Screen} from "@/domains/screen/_models/screen";
import {Seat} from "@/domains/seat/_models";
import type {
    FetchTheatreScreenDetailsViewDataConfig,
    TheatreScreenDetailsViewData
} from "@/domains/screen/_feat/view-data-admin/service/service.types";
import {Showing, ShowingPopulationPaths} from "@/domains/showing";

/**
 * Fetches the complete dataset for managing a specific screen.
 */
export async function fetchTheatreScreenDetailsViewData(
    {theatreSlug, screenSlug, recentShowingsCount}: FetchTheatreScreenDetailsViewDataConfig
): Promise<TheatreScreenDetailsViewData> {
    const theatre = await Theatre
        .findOne({slug: theatreSlug})
        .populate(TheatreVirtualPopulationPaths)
        .lean<TheatreWithVirtuals>({virtuals: true});

    if (!theatre) {
        throw createHttpError(404, "Theatre not found!");
    }

    const screen = await Screen
        .findOne({theatre: theatre._id, slug: screenSlug})
        .lean({virtuals: true});

    if (!screen) {
        throw createHttpError(404, "Screen not found!");
    }

    const seats = await Seat
        .find({screen: screen._id})
        .populate(["screen", "theatre"])
        .lean();

    const recentShowings = await Showing
        .find({theatre: theatre._id, screen: screen._id})
        .sort({startTime: 1})
        .limit(recentShowingsCount ?? 10)
        .populate(ShowingPopulationPaths)
        .lean({virtuals: true});

    return {
        theatre,
        screen,
        seats,
        recentShowings,
    };
}