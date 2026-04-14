/**
 * @fileoverview Compiles and exports the Genre Mongoose model.
 * Ensures middleware hooks are registered before model instantiation.
 */

import {Model, model} from "mongoose";
import type {GenreSchemaFields} from "./Genre.types.js";
import {GenreSchema} from "@domains/genre/models/genre/Genre.schema";
import "./Genre.hooks.js";

/**
 * Compiled Mongoose model for Genre documents.
 */
export const Genre: Model<GenreSchemaFields> = model<GenreSchemaFields>("Genre", GenreSchema);