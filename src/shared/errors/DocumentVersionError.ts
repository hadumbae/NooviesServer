import {Types} from "mongoose";

/**
 * Constructor parameters for {@link DocumentVersionError}.
 */
type ErrorConstructor = {
    /** Optional human-readable error message. */
    message?: string;
    /** Name of the Mongoose model associated with the error. */
    model: string;
    /** Identifier of the affected document. */
    _id: Types.ObjectId;
    /** Raw update data. */
    raw: unknown;
};

/**
 * Error representing a document version conflict or mismatch.
 *
 * Typically thrown when optimistic concurrency control fails
 * (e.g. stale document versions during updates).
 */
export class DocumentVersionError extends Error {
    /** Name of the model where the error occurred. */
    protected readonly model: string;

    /** Identifier of the affected document. */
    protected readonly _id: Types.ObjectId;

    /** Raw versioning or persistence error data. */
    protected readonly raw: unknown;

    /**
     * Creates a new {@link DocumentVersionError}.
     *
     * @param params - Error metadata including model, document ID, and raw payload.
     */
    constructor(params: ErrorConstructor) {
        const {message, model, raw, _id} = params;

        super(message);

        this.model = model;
        this._id = _id;
        this.raw = raw;
    }

    /**
     * Returns a concise string representation of the error.
     */
    toString(): string {
        return `[${this.model}] Version Error for document: ${this._id}`;
    }

    /**
     * Serializes the error into a JSON-safe structure.
     */
    toJSON(): Record<string, any> {
        return {
            model: this.model,
            message: this.message,
            _id: this._id,
            raw: this.raw,
        };
    }
}
