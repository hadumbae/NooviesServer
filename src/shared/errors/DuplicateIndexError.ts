/**
 * @fileoverview Custom error class for handling duplicate index conflicts in database models.
 */

type DuplicateIndexConstructor = {
    message?: string;
    model: string;
    index: string;
};

/**
 * Custom error thrown when a duplicate index conflict occurs on a database model.
 */
export class DuplicateIndexError extends Error {
    protected readonly index: string;

    constructor({message, index}: DuplicateIndexConstructor) {
        super(message);
        this.index = index;
    }
}