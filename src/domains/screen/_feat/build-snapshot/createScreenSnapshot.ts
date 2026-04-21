/**
 * @fileoverview Factory logic for generating immutable Screen snapshots.
 * Derived from the live Screen state to preserve historical accuracy for Showings.
 */

import {Types} from "mongoose";
import type {ScreenSnapshotSchemaFields} from "@domains/screen/models/screen-snapshot/ScreenSnapshot.types";
import Screen from "@domains/screen/models/screen/Screen.model";
import {DocumentNotFoundError} from "@shared/errors/DocumentNotFoundError";
import {ScreenSnapshot} from "@domains/screen/models/screen-snapshot/ScreenSnapshot.model";
import {InconsistentDataError} from "@shared/errors/InconsistentDataError";
import {ScreenSnapshotInputSchema} from "@domains/screen/_feat/validate-submit";

/**
 * Generates a validated snapshot payload from a live Screen document.
 * @throws {DocumentNotFoundError} If the screenID does not point to an existing document.
 * @throws {InconsistentDataError} If the source screen data fails the snapshot schema validation.
 */
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