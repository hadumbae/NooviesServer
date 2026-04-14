/**
 * @fileoverview Reusable Mongoose schema options for slug fields.
 * Standardizes validation for unique, URL-safe identifiers across schemas.
 */

import type { SchemaTypeOptions } from "mongoose";

/**
 * Common configuration for string-based slugs.
 */
const SlugSchemaTypeOptions: SchemaTypeOptions<string> = {
    type: String,
    minlength: [1, "Slug must not be an empty string."],
    maxlength: [50, "Slug must not be more than 50 characters."],
    unique: [true, "Slug must be unique."],
    required: [true, "Slug is required."],
};

export default SlugSchemaTypeOptions;