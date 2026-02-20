/**
 * @file Normalize an input to ObjectId when possible.
 * isValidObjectIdOrSlug.ts
 */

import { Types } from "mongoose";
import type {SlugString} from "../../schema/strings/SlugStringSchema.js";

/**
 * Converts a valid 24-char hex string to ObjectId; otherwise returns the input unchanged.
 *
 * @param _id - ObjectId or potential hex string
 * @returns ObjectId if valid hex; else the original string
 */
export function isValidObjectIdOrSlug(_id: Types.ObjectId | string): Types.ObjectId | SlugString {
    if (_id instanceof Types.ObjectId) return _id;
    return Types.ObjectId.isValid(_id) ? Types.ObjectId.createFromHexString(_id) : _id;
}