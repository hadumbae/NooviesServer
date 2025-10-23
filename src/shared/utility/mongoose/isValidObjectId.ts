import { Types } from "mongoose";
import createHttpError from "http-errors";

/**
 * Validates and normalizes a value as a Mongoose ObjectId.
 *
 * This function accepts either a string or a `Types.ObjectId` instance.
 * - If the value is already an `ObjectId`, it is returned as-is.
 * - If the value is a valid ObjectId string, it is converted into a `Types.ObjectId`.
 * - Otherwise, an HTTP 400 error is thrown.
 *
 * @param _id - The value to validate as an ObjectId.
 * @returns The validated `Types.ObjectId` instance.
 * @throws {HttpError} 400 if the value is not a valid ObjectId.
 *
 * @example
 * ```ts
 * const id1 = isValidObjectId("650d9f7b2f8c2b001c9e4b8a");
 * const id2 = isValidObjectId(new Types.ObjectId());
 * ```
 */
export default function isValidObjectId(_id: string | Types.ObjectId): Types.ObjectId {
    if (_id instanceof Types.ObjectId) {
        return _id;
    }

    if (Types.ObjectId.isValid(_id)) {
        return new Types.ObjectId(_id);
    }

    throw createHttpError(400, "Invalid ID format!");
}
