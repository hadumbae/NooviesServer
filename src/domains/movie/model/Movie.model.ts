import {Model, model,} from "mongoose";
import {MovieSchema} from "./Movie.schema.js";

import "./Movie.middleware.js";
import type {MovieSchemaFields} from "./Movie.types.js";

/**
 * Mongoose model for movies.
 *
 * @remarks
 * This is the primary model for performing CRUD operations on Movie documents.
 * It includes all schema definitions, virtuals, and middleware hooks.
 *
 * @example
 * ```ts
 * import MovieModel from './Movie.model.js';
 *
 * // Find all available movies
 * const movies = await MovieModel.find({ isAvailable: true });
 * ```
 */
const MovieModel: Model<MovieSchemaFields> = model<MovieSchemaFields>("Movie", MovieSchema);

export default MovieModel;