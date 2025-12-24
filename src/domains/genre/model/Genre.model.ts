import {Model, model} from "mongoose";
import GenreSchema from "./Genre.schema.js";
import type {GenreSchemaFields} from "./Genre.types.js";

import "./Genre.virtuals.js";
import "./Genre.middleware.js";

/**
 * Mongoose model for genres.
 *
 * Applies schema, virtuals, and middleware.
 */
const Genre: Model<GenreSchemaFields> = model<GenreSchemaFields>("Genre", GenreSchema);

export default Genre;
