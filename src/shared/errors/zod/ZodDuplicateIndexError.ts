import type {ZodIssue} from "zod";
import {Types} from "mongoose";

/**
 * Constructor parameters for {@link ZodDuplicateIndexError}.
 */
type ErrorConstructor = {
    /** Database index that caused the duplication error. */
    index: string;
    /** Zod validation issues associated with the duplicate index. */
    errors: ZodIssue[];
    /** Optional human-readable error message. */
    message?: string;
    /** Identifier of the affected document, if available. */
    _id?: Types.ObjectId;
    /** Raw database or persistence-layer payload. */
    raw?: unknown;
    /** Name of the associated model, if available. */
    model?: string;
};

/**
 * Error representing a duplicate index violation surfaced as Zod validation issues.
 *
 * Commonly thrown when a unique or compound index constraint is violated and
 * mapped into a Zod-compatible error structure.
 */
export class ZodDuplicateIndexError extends Error {
    /** Database index that triggered the error. */
    public readonly index: string;

    /** Zod validation issues describing the duplicate constraint. */
    public readonly errors: ZodIssue[];

    /** Identifier of the affected document, if known. */
    public readonly _id?: Types.ObjectId;

    /** Name of the associated model, if known. */
    public readonly model?: string;

    /** Raw persistence or database error payload. */
    public readonly raw?: unknown;

    /**
     * Creates a new {@link ZodDuplicateIndexError}.
     *
     * @param params - Error metadata including index, Zod issues, and optional document context.
     */
    constructor(params: ErrorConstructor) {
        const {message, errors, raw, index, _id, model} = params;
        super(message);

        this.errors = errors;
        this.index = index;
        this.raw = raw;
        this._id = _id;
        this.model = model;
    }

    /**
     * Serializes the error into a client-safe JSON structure.
     */
    toJSON() {
        return {
            message: this.message,
            errors: this.errors,
        };
    }

    /**
     * Returns an extended structure suitable for structured logging.
     */
    toLog() {
        return {
            message: this.message,
            errors: this.errors,
            raw: this.raw,
            stack: this.stack,
            timestamp: new Date().toISOString(),
            document: {
                _id: this._id,
                model: this.model,
                index: this.index,
            },
        };
    }
}
