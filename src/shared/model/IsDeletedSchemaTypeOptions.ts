/**
 * @file Schema configuration for soft-deletion flags.
 * @filename IsDeletedSchemaTypeOptions.ts
 */

import type {SchemaTypeOptions} from "mongoose";

/**
 * Mongoose {@link SchemaTypeOptions} for tracking soft-deleted states.
 * Defaults to `false`.
 */
export const IsDeletedSchemaTypeOptions: SchemaTypeOptions<boolean> = {
    type: Boolean,
    default: false,
}