import { Types } from "mongoose";

/**
 * @type ModelObject
 * @description
 * Base shape for persisted MongoDB documents.
 *
 * Provides a shared `_id` field for models that need to expose
 * their ObjectId without depending on full Mongoose document types.
 */
export type ModelObject = {
  /** MongoDB-generated unique identifier. */
  _id: Types.ObjectId;
};
