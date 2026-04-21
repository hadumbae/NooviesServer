/**
 * @fileoverview Mongoose model for cinema screens.
 * Orchestrates the registration of the Screen schema, integrating virtuals,
 * middleware hooks, and database indexes.
 */

import {Model, model} from "mongoose";
import type {ScreenSchemaFields} from "./Screen.types";
import {ScreenSchema} from "./Screen.schema";

import "./Screen.virtuals";
import "./Screen.hooks";
import "./Screen.indexes";

/**
 * The Screen Model.
 */
export const Screen: Model<ScreenSchemaFields> = model<ScreenSchemaFields>("Screen", ScreenSchema);
