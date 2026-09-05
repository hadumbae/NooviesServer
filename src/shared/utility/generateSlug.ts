/**
 * @fileoverview Utility functions for generating unique, URL-safe slugs with random ID suffixes.
 */

import {slugify} from "@/shared/imports";
import {customAlphabet} from "nanoid";

/** Generates a URL-safe slug from a string with an appended random alphanumeric suffix. */
export function generateSlug(text: string, idLength: number = 6, maxLength: number = 50): string {
    const baseSlug = slugify(text, {lower: true, strict: true});
    const slug = baseSlug.slice(0, maxLength).replace(/-+$/, "");

    const nID = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", idLength);

    return `${slug}-${nID()}`;
}