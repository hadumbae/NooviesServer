/**
 * @fileoverview Defines the base structure for database model objects.
 */

import { Types } from "mongoose";

/** Base type for objects containing a Mongoose ObjectId. */
export type ModelObject = {
  _id: Types.ObjectId;
};
