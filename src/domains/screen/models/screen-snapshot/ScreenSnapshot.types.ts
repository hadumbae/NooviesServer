/**
 * @fileoverview Immutable field definitions for Screen snapshots.
 * Represents the persistent state of an auditorium used in historical records.
 */

import {Types} from "mongoose";
import type {ScreenType} from "@domains/screen/validation";

/**
 * Type representing the structure of a Screen snapshot.
 */
export type ScreenSnapshotSchemaFields = {
    theatre: Types.ObjectId;
    name: string;
    screenType: ScreenType;
}