/**
 * @file Mongoose populate path type.
 * PopulatePath.ts
 */

import type { PopulateOptions } from "mongoose";

/**
 * Represents a populate path definition.
 */
export type PopulatePath = string | PopulateOptions;