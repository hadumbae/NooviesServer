/**
 * @file Base state for tracking record deletion lifecycle.
 * @filename ModelSoftDelete.ts
 */

/**
 * Common flags for models implementing soft-deletion.
 */
export type ModelSoftDelete = {
    /** * Indicates if the record is hidden from standard queries.
     * Typically matches {@link IsDeletedSchemaTypeOptions}.
     */
    isDeleted: boolean;

    /** * Audit timestamp via {@link DeletedAtSchemaTypeOptions}.
     * Used for restoration or TTL-based permanent cleanup.
     */
    deletedAt: Date | null;
}