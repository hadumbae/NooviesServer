/**
 * @file isValidObjectId.ts
 * Utility for validating and normalizing ObjectId values.
 */

import {Types} from "mongoose";
import createHttpError from "http-errors";

/**
 * Ensures the input is a valid ObjectId.
 */
export default function isValidObjectId(_id: string | Types.ObjectId, message?: string): Types.ObjectId {
    if (_id instanceof Types.ObjectId) {
        return _id;
    }

    if (Types.ObjectId.isValid(_id)) {
        return Types.ObjectId.createFromHexString(_id);
    }

    throw createHttpError(400, message ?? "Invalid ID format!");
}
