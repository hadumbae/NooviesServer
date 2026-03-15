/**
 * @file Error type for request validation failures.
 * Preserves Zod validation issues for structured handling and logging.
 * @filename RequestValidationError.ts
 */

import type {ZodIssue} from "zod";

/**
 * Parameters used to construct a {@link RequestValidationError}.
 */
type ErrorParams = {
    /** Optional high-level error message. */
    message?: string;

    /** Zod validation issues describing each failure. */
    errors: ZodIssue[];

    /** Original input that failed validation. */
    raw?: unknown;

    /** Optional HTTP status code associated with the validation failure. */
    statusCode?: number;
};

/**
 * Error representing a failed request validation.
 *
 * Wraps `ZodIssue[]` to retain structured validation details
 * such as paths and error messages.
 */
export class RequestValidationError extends Error {
    /** Zod validation issues associated with the failure. */
    public readonly errors: ZodIssue[];

    /** Original input that failed validation, if provided. */
    public readonly raw?: unknown;

    /** Optional HTTP status code associated with the error. */
    public readonly statusCode?: number;

    /**
     * @param params - Validation error details.
     */
    constructor(params: ErrorParams) {
        const {message, errors, raw, statusCode} = params;

        super(message);

        this.name = "RequestValidationError";

        this.errors = errors;
        this.raw = raw;
        this.statusCode = statusCode;
    }

    /**
     * Returns a concise string representation of the error.
     */
    toString(): string {
        return `[${this.name}] Request Validation Failed ${this.statusCode && `| HTTP${this.statusCode}`}`;
    }

    /**
     * Serializes the error for structured logging or API responses.
     *
     * @returns JSON-safe representation of the validation error.
     */
    toJSON(): Record<string, any> {
        return {
            raw: this.raw,
            message: this.message,
            errors: this.errors,
            statusCode: this.statusCode,
        }
    }
}