/**
 * @file Screen.model.ts
 *
 * @summary
 * Mongoose model for cinema screens.
 *
 * @description
 * Registers the Screen schema with Mongoose and ensures
 * all related virtuals and middleware are loaded.
 */

import { Model, model } from "mongoose";

import type { ScreenSchemaFields } from "./Screen.types.js";
import { ScreenSchema } from "./Screen.schema.js";

import "./Screen.virtuals.js";
import "./Screen.middleware.js";

/**
 * @summary
 * Screen model.
 *
 * @description
 * Provides access to the Screen collection and applies
 * schema-level validation, virtuals, and middleware.
 */
const Screen: Model<ScreenSchemaFields> =
    model<ScreenSchemaFields>("Screen", ScreenSchema);

export default Screen;
