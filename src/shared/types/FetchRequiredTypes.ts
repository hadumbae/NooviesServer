/**
 * @file Parameter types for required fetch operations.
 * @filename FetchRequiredTypes.ts
 */

import type {RequestOptions} from "./request-options/RequestOptions.js";
import {type Model, Types} from "mongoose";
import type {SlugString} from "../schema/strings/SlugStringSchema.js";
import type {ModelObject} from "./ModelObject.js";

/**
 * Parameters for fetching a required resource by identifier.
 *
 * Accepts either `_id` or `slug`, but not both.
 *
 * @typeParam TSchema - Mongoose document shape for the target model.
 */
export type FetchRequiredByIdentifierParams<TSchema extends ModelObject> = {
    /** Target Mongoose model. */
    model: Model<TSchema>;

    /** Optional request configuration. */
    options?: Omit<RequestOptions, "limit">;

    notFoundMessage?: string;
} & (
    | { _id: Types.ObjectId; slug?: never }
    | { _id?: never; slug: SlugString }
    );