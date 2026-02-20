/**
 * @file Mongoose document type for Movie.
 * MovieDocument.ts
 */

import type { Document } from "mongoose";
import type { MovieSchemaFields } from "../model/Movie.types.js";

/**
 * Typed Mongoose document for Movie schema fields.
 */
export type MovieDocument = Document<unknown, {}, MovieSchemaFields> & MovieSchemaFields;