import slugify from "../imports/slugify.js";
import {customAlphabet} from "nanoid";

/**
 * Generates a URL-safe slug with a short unique suffix.
 *
 * Converts the input text into a lowercase, strict slug and appends
 * a 6-character alphanumeric NanoID to ensure uniqueness.
 *
 * @param text - Source text to slugify
 * @returns A unique, URL-safe slug string
 */
export default function generateSlug(text: string) {
    const slug = slugify(text, {lower: true, strict: true});
    const nID = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

    return `${slug}-${nID}`;
}
