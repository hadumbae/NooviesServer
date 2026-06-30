/**
 * @fileoverview Defines the Mongoose model for role types within the system.
 */

import {model, Model} from "mongoose";
import type {RoleTypeSchemaFields} from "@/domains/role-types/_models/RoleType.types";
import {RoleTypeSchema} from "./RoleType.schema.js";

import "src/domains/role-types/_models/RoleType.indexes";
import "src/domains/role-types/_models/RoleType.hooks";
import "src/domains/role-types/_models/RoleType.virtuals";

/** Mongoose model for interacting with the RoleType collection. */
export const RoleTypeModel: Model<RoleTypeSchemaFields> = model<RoleTypeSchemaFields>("RoleType", RoleTypeSchema);

