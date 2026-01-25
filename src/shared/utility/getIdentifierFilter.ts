import { Types } from "mongoose";
import type { SlugString } from "../schema/strings/SlugStringSchema.js";

/**
 * Builds a MongoDB filter object from a polymorphic identifier.
 *
 * Resolves to:
 * - `{ _id }` when provided an ObjectId
 * - `{ slug }` when provided a slug string
 *
 * Useful for repository methods that accept either identifier type.
 *
 * @param identifier - MongoDB ObjectId or slug string
 * @returns MongoDB-compatible filter object
 */
export function getIdentifierFilter(
    identifier: Types.ObjectId | SlugString,
): Record<string, Types.ObjectId | SlugString> {
    return identifier instanceof Types.ObjectId
        ? { _id: identifier }
        : { slug: identifier };
}
