/**
 * @fileoverview Defines the Mongoose model for role types within the system.
 */

import {model, Model} from "mongoose";
import type {RoleTypeSchemaFields} from "@domains/roleType/model/RoleType.types";
import {RoleTypeSchema} from "./RoleType.schema.js";

import "@domains/roleType/model/RoleType.indexes";
import "@domains/roleType/model/RoleType.hooks";
import "@domains/roleType/model/RoleType.virtuals";

/** Mongoose model for interacting with the RoleType collection. */
export const RoleTypeModel: Model<RoleTypeSchemaFields> = model<RoleTypeSchemaFields>("RoleType", RoleTypeSchema);

