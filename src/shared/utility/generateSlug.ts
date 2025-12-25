import slugify from "../imports/slugify.js";
import {customAlphabet} from "nanoid";

/**
 * Generates a URL-safe, unique slug.
 *
 * The input text is slugified using strict, lowercase rules, trimmed to a
 * maximum length, and suffixed with a short NanoID to guarantee uniqueness.
 *
 * @param text - Source text to convert into a slug
 * @param idLength - Length of the NanoID suffix (default: 6)
 * @param maxLength - Maximum length of the base slug before the suffix (default: 50)
 * @returns A unique, URL-safe slug string
 */
export default function generateSlug(text: string, idLength: number = 6, maxLength: number = 50): string {
    const baseSlug = slugify(text, {lower: true, strict: true});
    const slug = baseSlug.slice(0, maxLength).replace(/-+$/, "");

    const nID = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", idLength);

    return `${slug}-${nID()}`;
}
