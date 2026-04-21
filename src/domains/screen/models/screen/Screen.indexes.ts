/**
 * @fileoverview Index definitions for the Screen schema.
 * Enforces data integrity and optimizes query performance for relational lookups.
 */

import {ScreenSchema} from "@domains/screen/models/screen/Screen.schema";

/**
 * Compound Unique Index: theatre + slug
 */
ScreenSchema.index(
    {theatre: 1, slug: 1},
    {unique: true, name: "idx_unique_theatre_screen_slug"}
);