import { z } from 'zod';
import { RequiredStringSchema } from "../../../shared/schema/strings/RequiredStringSchema.js";

/**
 * Zod schema for validating genre input data.
 *
 * Ensures that user-provided genre data meets the required constraints
 * before creating or updating a genre document.
 *
 * ## Fields
 * - `name` (string, required) – The name of the genre. Must be 1–150 characters.
 * - `description` (string, required) – Description of the genre. Maximum 1000 characters.
 *
 * @example
 * ```ts
 * import { GenreInputSchema } from './GenreInputSchema.js';
 *
 * const input = {
 *   name: "Comedy",
 *   description: "A genre characterized by humor and entertainment."
 * };
 *
 * const parsed = GenreInputSchema.parse(input); // throws if invalid
 * ```
 */
export const GenreInputSchema = z.object({
    /**
     * The name of the genre.
     *
     * - Required.
     * - Minimum length: 1 character.
     * - Maximum length: 150 characters.
     * - Example: "Action", "Comedy".
     */
    name: RequiredStringSchema
        .max(150, "Must be 150 characters or less."),

    /**
     * Description of the genre.
     *
     * - Required.
     * - Maximum length: 1000 characters.
     * - Example: "A genre characterized by suspense and excitement."
     */
    description: RequiredStringSchema
        .max(1000, "Must be 1000 characters or less."),
});
