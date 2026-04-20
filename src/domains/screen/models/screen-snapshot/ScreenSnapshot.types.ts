/**
 * @file ScreenSnapshot.types.ts
 *
 * @description
 * Immutable snapshot field definitions for a cinema screen.
 *
 * Captures the essential identity and configuration of a screen at a specific
 * point in time. Intended for embedding in snapshot-based documents to prevent
 * historical drift when the source screen changes.
 */

import { Types } from "mongoose";
import type { ScreenTypeEnumType } from "../../schema/enum/ScreenTypeEnum.js";

/**
 * Screen snapshot schema fields.
 */
export interface ScreenSnapshotSchemaFields {
    /** Owning theatre reference at snapshot time. */
    theatre: Types.ObjectId;

    /** Human-readable screen name (e.g. "Screen 1"). */
    name: string;

    /** Screen classification (e.g. Standard, IMAX, 4DX). */
    screenType: ScreenTypeEnumType;
}
