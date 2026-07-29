/**
 * @fileoverview Defines the Mongoose model for User documents.
 */

import {Model, model} from "mongoose";
import type {UserSchemaFields} from "@/domains/users/model/user/User.types.js";
import {UserSchema} from "@/domains/users/model/user/User.schema.js";
import "@/domains/users/model/user/User.hooks";
import "@/domains/users/model/user/User.virtuals";

/** The Mongoose model for interacting with the users collection. */
export const User: Model<UserSchemaFields> = model<UserSchemaFields>("User", UserSchema);
