import {Types} from "mongoose";

import {ObjectIdStringSchema} from "./ObjectIdStringSchema.js";

/**
 * A Zod schema that parses a valid ObjectID string into a `mongoose.Types.ObjectId` instance.
 *
 * Builds on `ObjectIdStringSchema` by transforming the string into an actual ObjectId object.
 * Useful when working directly with MongoDB document IDs in code.
 *
 * @example
 * const objectId = ObjectIdStringSchema.parse("507f1f77bcf86cd799439011");
 * console.log(objectId instanceof Types.ObjectId); // true
 */
export const ParsedObjectIdStringSchema = ObjectIdStringSchema
    .transform((_id) => new Types.ObjectId(_id));