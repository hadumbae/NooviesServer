/**
 * @file Compiles and exports the Genre Mongoose model.
 * @filename Genre.model.ts
 */

import {Model, model} from "mongoose";
import GenreSchema from "./Genre.schema.js";
import type {GenreSchemaFields} from "./Genre.types.js";

/**
 * Static import of hooks to ensure middleware is registered before model instantiation.
 */
import "./Genre.hooks.js";

/**
 * The compiled Mongoose model for Genre documents.
 * @remarks Integrates {@link GenreSchema}, its associated hooks, and TypeScript fields.
 */
const Genre: Model<GenreSchemaFields> = model<GenreSchemaFields>("Genre", GenreSchema);

export default Genre;