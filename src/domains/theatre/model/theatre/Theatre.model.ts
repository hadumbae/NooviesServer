/**
 * @fileoverview Mongoose model registration for the Theatre domain.
 * Orchestrates the compilation of the Theatre schema into a functional model,
 * integrating virtuals, hooks, and lifecycle middleware.
 */

import { Model, model } from "mongoose";
import { TheatreSchema } from "./Theatre.schema";
import type { TheatreSchemaFields } from "./Theatre.types";

import "./Theatre.virtuals";
import "./Theatre.hooks";

/**
 * The Theatre Model.
 */
export const Theatre: Model<TheatreSchemaFields> = model<TheatreSchemaFields>("Theatre", TheatreSchema);