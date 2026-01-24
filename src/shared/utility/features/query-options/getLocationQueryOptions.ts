import type {Request} from "express";
import type {LocationQueryOptions} from "../../../schema/features/location-query-options/LocationQueryOptions.types.js";
import {
    LocationQueryOptionsSchema
} from "../../../schema/features/location-query-options/LocationQueryOptions.schema.js";
import createHttpError from "http-errors";

export function getLocationQueryOptions(req: Request): LocationQueryOptions {
    const {data, success} = LocationQueryOptionsSchema.safeParse(req.query);

    if (!success) {
        throw createHttpError(400, "Invalid query parameters");
    }

    return data;
}