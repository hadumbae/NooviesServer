import type { SchemaTypeOptions } from "mongoose";

/**
 * @file SlugSchemaTypeOptions.ts
 *
 * @summary
 * Reusable Mongoose schema options for `slug` fields.
 *
 * @description
 * Defines a standardized schema configuration for slug fields that:
 * - Enforces string type
 * - Requires uniqueness at the database level
 * - Marks the field as required with a validation message
 *
 * Intended to be shared across schemas that expose a public or URL-safe slug.
 */
const SlugSchemaTypeOptions: SchemaTypeOptions<string> = {
    type: String,
    unique: [true, "Slug must be unique."],
    required: [true, "Slug is required."],
};

export default SlugSchemaTypeOptions;
