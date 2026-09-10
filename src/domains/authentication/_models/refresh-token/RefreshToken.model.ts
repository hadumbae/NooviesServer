/**
 * @fileoverview Mongoose model definition for the RefreshToken entity.
 */

import {model, type Model} from "mongoose";
import type {RefreshTokenSchemaFields} from "@/domains/authentication/_models/refresh-token/RefreshToken.types";
import { RefreshTokenSchema } from "@/domains/authentication/_models/refresh-token/RefreshToken.schema";

/** Mongoose model for querying and persisting RefreshToken documents. */
export const RefreshToken: Model<RefreshTokenSchemaFields> = model<RefreshTokenSchemaFields>("RefreshToken", RefreshTokenSchema);