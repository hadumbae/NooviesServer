import {Types} from "mongoose";
import createHttpError from "http-errors";

export default function isValidObjectId(_id: string | Types.ObjectId) {
    if (_id instanceof Types.ObjectId) {
        return _id;
    }

    if (Types.ObjectId.isValid(_id)) {
        return new Types.ObjectId(_id);
    }

    throw createHttpError(400, "Invalid ID format!");
}