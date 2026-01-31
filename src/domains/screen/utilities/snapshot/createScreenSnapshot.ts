/**
 * @file createScreenSnapshot.ts
 *
 * Factory function for creating an immutable screen snapshot.
 *
 * Resolves a live {@link Screen} document and derives a validated
 * snapshot payload representing the screen’s state at a specific
 * point in time.
 *
 * @remarks
 * This function is intended for write-once snapshot generation.
 * It performs strict validation to ensure snapshot integrity and
 * will throw domain errors if the source data is missing or invalid.
 */

import { Types } from "mongoose";
import type { ScreenSnapshotSchemaFields } from "../../model/screen-snapshot/ScreenSnapshot.types.js";
import Screen from "../../model/Screen.model.js";
import { DocumentNotFoundError } from "../../../../shared/errors/DocumentNotFoundError.js";
import { ScreenSnapshotInputSchema } from "../../schema/ScreenSnapshotInputSchema.js";
import { ScreenSnapshot } from "../../model/screen-snapshot/ScreenSnapshot.model.js";
import { InconsistentDataError } from "../../../../shared/errors/InconsistentDataError.js";

/**
 * Creates an immutable snapshot of a screen.
 *
 * @param screenID - Identifier of the source screen document.
 * @returns A validated screen snapshot ready for persistence.
 *
 * @throws {DocumentNotFoundError}
 * Thrown when the source screen document cannot be found.
 *
 * @throws {InconsistentDataError}
 * Thrown when the source screen data fails snapshot validation.
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

    const { data, success } = ScreenSnapshotInputSchema.safeParse({
        theatre: screen.theatre,
        screenType: screen.screenType,
        name: screen.name,
    });

    if (!success) {
        throw new InconsistentDataError({
            modelName: ScreenSnapshot.name,
            message: "Inconsistent data, unable to create snapshot.",
        });
    }

    return data;
}
