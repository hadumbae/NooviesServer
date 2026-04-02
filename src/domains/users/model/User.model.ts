/**
 * @file User.model.ts
 * Exposes the Mongoose model for user documents.
 */

import {Model, model} from "mongoose";
import type {UserSchemaFields} from "./User.types.js";
import {UserSchema} from "@models/User.schema.js";
import "./User.hooks";

/**
 * User collection model.
 */
const User: Model<UserSchemaFields> = model<UserSchemaFields>("User", UserSchema);
export default User;
