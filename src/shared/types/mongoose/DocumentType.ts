/**
 * @file Mongoose document type helper.
 * @filename DocumentType.ts
 */

import type {Document} from "mongoose";
import type {ModelObject} from "../ModelObject.js";

/**
 * Combines a Mongoose {@link Document} with its schema fields.
 *
 * @typeParam TSchema - Schema field shape for the document.
 */
export type DocumentType<TSchema extends ModelObject> =
    Document<unknown, {}, TSchema> & TSchema;