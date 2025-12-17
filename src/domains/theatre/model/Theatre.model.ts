import {Model, model} from "mongoose";
import {TheatreSchema} from "./Theatre.schema.js";

import "./Theatre.virtuals.js";
import "./Theatre.middleware.js";
import type {TheatreSchemaFields} from "./Theatre.types.js";

/**
 * @file Theatre.model.ts
 *
 * Mongoose model registration for the Theatre domain.
 *
 * This module:
 * - Registers the Theatre schema under the `"Theatre"` model name
 * - Ensures schema middleware and virtuals are loaded for side effects
 */
const Theatre: Model<TheatreSchemaFields> = model<TheatreSchemaFields>("Theatre", TheatreSchema);

export default Theatre;
