/**
 * @file ScreenSnapshotSchemaFields.ts
 *
 * @summary
 * Defines a snapshot structure for a cinema screen, capturing its essential state.
 */

import type { ScreenTypeEnumType } from "../../schema/enum/ScreenTypeEnum.js";

/**
 * Fields representing a screen snapshot.
 *
 * Used for storing a screen’s state at a specific point in time
 * (e.g., for showings, reservations, or theatre snapshots).
 */
export interface ScreenSnapshotSchemaFields {
    /** Name of the screen (e.g., "Screen 1") */
    name: string;

    /** Type of screen, defined by {@link ScreenTypeEnumType} (e.g., Standard, IMAX, 4DX) */
    screenType: ScreenTypeEnumType;
}
