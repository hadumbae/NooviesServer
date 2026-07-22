/**
 * @fileoverview Defines parameter types for fetching documents by unique identifiers.
 */

import type {QueryConfig} from "@/shared/_types/query-config/QueryConfig";
import {type Model, Types} from "mongoose";
import type {SlugString} from "@/shared/schema/strings/SlugStringSchema.js";
import type {ModelObject} from "@/shared/_types/model/ModelObject";

/** Parameters for fetching a required document by either its ObjectId or unique slug. */
export type FetchRequiredByIdentifierConfig<TSchema extends ModelObject> = {
    model: Model<TSchema>;
    options?: Omit<QueryConfig, "limit">;
    notFoundMessage?: string;
} & (
    | { _id: Types.ObjectId; slug?: never }
    | { _id?: never; slug: SlugString }
);