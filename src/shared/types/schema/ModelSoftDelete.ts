/**
 * @file Base state for tracking record deletion lifecycle.
 * @filename ModelSoftDelete.ts
 */

/**
 * Common flag for models implementing soft-deletion.
 */
export type ModelSoftDelete = {
    /** * Indicates if the record is hidden from standard queries.
     * Typically matches {@link IsDeletedSchemaTypeOptions}.
     */
    isDeleted?: boolean;
}