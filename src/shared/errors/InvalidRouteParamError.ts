/**
 * @fileoverview Defines a custom error class for route parameter validation failures.
 * Captures the raw input, the specific validation issues (Zod), and provides
 * structured formatting for logging and API responses.
 */

import type {ZodIssue} from "zod";

type ErrorConfig = {
    message?: string;
    raw: unknown;
    errors: ZodIssue[];
};

/**
 * Custom error class thrown when route parameters fail to match the expected schema.
 */
export class InvalidRouteParamError extends Error {
    public readonly raw: unknown;
    public readonly errors: ZodIssue[];

    constructor({message, raw, errors}: ErrorConfig) {
        super(message);

        this.raw = raw;
        this.errors = errors;

        this.name = this.constructor.name;
    }

    /**
     * Returns a human-readable summary of the validation error.
     */
    toString(): string {
        return `[INVALID] Invalid Route Params (Error Count : ${this.errors.length})`;
    }

    /**
     * Serializes the error object for JSON responses, ensuring that
     * validation details are accessible to the API consumer.
     */
    toJSON(): Record<string, unknown> {
        return {
            message: this.message,
            raw: this.raw,
            errors: this.errors,
        };
    }
}