/**
 * @fileoverview Defines the Mongoose model for movie documents.
 */

import {Model, model,} from "mongoose";
import {MovieSchema} from "src/domains/movie/model/movie/Movie.schema.js";
import type {MovieSchemaFields} from "src/domains/movie/model/movie/Movie.types.js";

import "./Movie.indexes.js";
import "./Movie.hooks.js";

/** Mongoose model for performing CRUD operations on Movie documents. */
export const Movie: Model<MovieSchemaFields> = model<MovieSchemaFields>("Movie", MovieSchema);
