/**
 * @fileoverview Logic for generating validated screen snapshots from existing screen documents.
 */

import {Types} from "mongoose";
import type {ScreenSnapshotSchemaFields} from "@/domains/screen/_models/screen-snapshot/ScreenSnapshot.types";
import {Screen} from "@/domains/screen/_models/screen";
import {DocumentNotFoundError} from "@/shared/errors/DocumentNotFoundError";
import {InconsistentDataError} from "@/shared/errors/InconsistentDataError";
import {ScreenSnapshotInputSchema} from "@/domains/screen/_feat/validate-submit";
import {ScreenSnapshot} from "@/domains/screen/_models/screen-snapshot";

/** Fetches a screen by ID and validates its data to create a snapshot object. */
export async function createScreenSnapshot(
    screenID: Types.ObjectId
): Promise<ScreenSnapshotSchemaFields> {
    const screen = await Screen.findById(screenID).lean();

    if (!screen) {
        throw new DocumentNotFoundError({
            model: Screen,
            identifier: screenID,
            message: "Failed to fetch screen for snapshot.",
        });
    }

    const {data, success} = ScreenSnapshotInputSchema.safeParse({
        theatre: screen.theatre,
        screenType: screen.screenType,
        name: screen.name,
    });

    if (!success) {
        throw new InconsistentDataError({
            modelName: ScreenSnapshot.name,
            message: "Source screen data is inconsistent; snapshot generation aborted.",
        });
    }

    return data;
}