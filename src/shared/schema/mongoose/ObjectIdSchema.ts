/**
 * @fileoverview Zod schema for validating and coercing MongoDB ObjectId values.
 */

import {Types} from "mongoose";
import {ObjectIdStringSchema} from "./ObjectIdStringSchema.js";
import {z} from "zod";

/** Schema that validates Hex strings or ObjectId instances and transforms them into Types.ObjectId. */
export const ObjectIdSchema = z
    .union([z.instanceof(Types.ObjectId), ObjectIdStringSchema])
    .transform(id => (typeof id === "string" ? new Types.ObjectId(id) : id));