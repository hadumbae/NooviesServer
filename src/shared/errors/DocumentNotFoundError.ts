/**
 * @file DocumentNotFoundError.ts
 *
 * Typed error thrown when a document cannot be resolved by identifier.
 *
 * @remarks
 * Carries the originating Mongoose model and the identifier used for lookup,
 * allowing consistent logging, serialization, and HTTP error mapping.
 */

import { type Model, Types } from "mongoose";

/**
 * Constructor parameters for {@link DocumentNotFoundError}.
 */
type ErrorConstructor<TModel> = {
    /** Optional override error message. */
    message?: string;

    /** Mongoose model the lookup was performed against. */
    model: Model<TModel>;

    /** Identifier used to resolve the document. */
    identifier: Types.ObjectId | string;
};

/**
 * Error indicating that a document could not be found for a given model.
 *
 * @template TModel - Model document shape.
 */
export class DocumentNotFoundError<TModel> extends Error {
    /** Model the lookup was attempted against. */
    protected model: Model<TModel>;

    /** Identifier used in the failed lookup. */
    protected identifier: Types.ObjectId | string;

    constructor({ message, model, identifier }: ErrorConstructor<TModel>) {
        super(message);

        this.model = model;
        this.identifier = identifier;
    }

    /**
     * Human-readable error string for logging and debugging.
     */
    toString(): string {
        return `[${this.model.name}] Document Not Found '${this.identifier.toString()}'`;
    }

    /**
     * Serializable error payload.
     *
     * @remarks
     * Intended for structured logging or API responses.
     */
    toJSON(): Record<string, unknown> {
        return {
            model: this.model.name,
            identifier: this.identifier.toString(),
        };
    }
}
