/**
 * @file BadRequestError.ts
 *
 * Custom HTTP 400 error for request validation failures.
 *
 * Commonly used when request parameters or query strings
 * fail schema validation (e.g. Zod).
 */

import type {ZodIssue} from "zod";

/**
 * Constructor parameters for {@link BadRequestError}.
 */
type ErrorConstructor = {
    /** Optional human-readable error message */
    message?: string;

    /** Validation issues produced by Zod */
    errors: ZodIssue[];
};

/**
 * Represents a client-side request error caused by
 * invalid parameters or query values.
 */
export class BadRequestError extends Error {
    /** Zod validation issues */
    readonly errors: ZodIssue[];

    constructor({message, errors}: ErrorConstructor) {
        super(message);
        this.errors = errors;
    }

    /**
     * Returns a concise string representation for logging.
     */
    toString(): string {
        return `[HTTP400] Bad Request, Invalid Parameters Or Queries.`;
    }

    /**
     * Serializes the error into a JSON-safe structure.
     *
     * Intended for API responses.
     */
    toJSON(): Record<string, any> {
        return {
            message: this.message,
            errors: this.errors,
        };
    }
}
