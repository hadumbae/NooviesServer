/**
 * @fileoverview Defines a utility type for Mongoose documents that preserves schema properties.
 */

import type {Document} from "mongoose";
import type {ModelObject} from "@/shared/_types/model/ModelObject";

/** Represents a Mongoose document combined with its underlying schema interface. */
export type DocumentType<TSchema extends ModelObject> = Document<unknown, {}, TSchema> & TSchema;