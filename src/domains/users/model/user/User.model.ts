/**
 * @file User.model.ts
 * Exposes the Mongoose model for user documents.
 */

import {Model, model} from "mongoose";
import type {UserSchemaFields} from "@/domains/users/model/user/User.types.js";
import {UserSchema} from "@/domains/users/model/user/User.schema.js";
import "src/domains/users/model/user/User.hooks";

/**
 * User collection model.
 */
export const User: Model<UserSchemaFields> = model<UserSchemaFields>("User", UserSchema);

