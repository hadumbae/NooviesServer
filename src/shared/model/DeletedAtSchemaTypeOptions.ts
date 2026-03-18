/**
 * @file Schema configuration for soft-deletion timestamps.
 * @filename DeletedAtSchemaTypeOptions.ts
 */

import type {SchemaTypeOptions} from "mongoose";

/**
 * Mongoose {@link SchemaTypeOptions} for tracking when a record was soft-deleted.
 * Defaults to `null`.
 */
export const DeletedAtSchemaTypeOptions: SchemaTypeOptions<Date | null> = {
    type: Date,
    default: null,
};