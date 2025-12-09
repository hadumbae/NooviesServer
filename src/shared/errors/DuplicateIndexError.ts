/**
 * ⚡ DuplicateIndexConstructor
 *
 * Constructor parameters for {@link DuplicateIndexError}.
 *
 * Represents metadata about a duplicate index conflict originating
 * from a database model (commonly MongoDB).
 */
type DuplicateIndexConstructor = {
    /** Optional custom error message. */
    message?: string;
    /** Name of the model where the index conflict occurred. */
    model: string;
    /** Name of the duplicated index. */
    index: string;
};

/**
 * ⚡ DuplicateIndexError
 *
 * Custom error class thrown when a database operation violates
 * a unique index constraint.
 *
 * Stores the duplicated index name for downstream handling (e.g.,
 * API formatting, logging, or mapping to user-friendly messages).
 *
 * @example
 * ```ts
 * throw new DuplicateIndexError({
 *   model: "Seat",
 *   index: "row_seatNumber_unique",
 *   message: "Duplicate seat number in this row."
 * });
 * ```
 */
export default class DuplicateIndexError extends Error {
    /** The name of the duplicated index that triggered this error. */
    protected readonly index: string;

    constructor({ message, index }: DuplicateIndexConstructor) {
        super(message);
        this.index = index;
    }
}
